import {
    openDB,
    type IDBPDatabase,
    type IndexNames,
    type StoreKey,
    type StoreNames,
    type StoreValue
} from 'idb';
import { logger } from './_logger';

export interface IDBApi<T> {
    get(): Promise<IDBPDatabase<T>>;
    state(storeName: StoreNames<T>): Promise<'not-found' | 'empty' | 'populated'>;
    delete(storeName: StoreNames<T>, keys: StoreKey<T, StoreNames<T>>[]): Promise<void>;
    exists(storeName: StoreNames<T>): Promise<boolean>;
    isPopulated(storeName: StoreNames<T>): Promise<boolean>;
    put(storeName: StoreNames<T>, doc: StoreValue<T, StoreNames<T>>): Promise<void>;
    bulkPut(storeName: StoreNames<T>, docs: StoreValue<T, StoreNames<T>>[]): Promise<void>;
    findByField(storeName: StoreNames<T>, field: IndexNames<T, StoreNames<T>>, value: any): Promise<StoreValue<T, StoreNames<T>>[]>;
    getAllKeys(storeName: StoreNames<T>): Promise<StoreKey<T, StoreNames<T>>[]>;
    notifyChange(payload: any): void;
    onChange(callback: (payload: any) => void): void;
    deleteDb(): Promise<void>;
    clearStore(storeName: StoreNames<T>): Promise<void>;
    paginate(storeName: StoreNames<T>, limit: number, offset: number): Promise<T[]>;
}

type StoreSchema = {
    keyPath?: string;
    indices?: {
        name: string;
        keyPath: string | string[];
        options?: IDBIndexParameters;
    }[];
};

type StoreDefinition = Record<string, StoreSchema>;

export async function idb<T = unknown>(
    dbName: string,
    version?: number,
    storeDefs?: StoreDefinition
): Promise<IDBApi<T>|null> {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
            console.error('[IDB] IndexedDB is not available in this context.');
            return null;
        }

    const DB_INSTANCE = await openDB<T>(dbName, version, {
        upgrade(db) {
            if (!storeDefs) return;

            for (const [storeName, schema] of Object.entries(storeDefs) as [StoreNames<T>, StoreSchema][]) {
                if (!db.objectStoreNames.contains(storeName)) {
                    const store = db.createObjectStore(storeName, {
                        keyPath: schema.keyPath ?? 'id'
                    });

                    if (schema.indices) {
                        for (const index of schema.indices) {
                            store.createIndex(index.name as IndexNames<T, StoreNames<T>>, index.keyPath, index.options);
                        }
                    }
                }
            }
        }
    });

    async function _get(): Promise<IDBPDatabase<T>> {
        return DB_INSTANCE;
    }

    async function _state(storeName: StoreNames<T>): Promise<'not-found' | 'empty' | 'populated'> {
        try {
            const db = await _get();

            if (!db.objectStoreNames.contains(storeName)) {
                return 'not-found';
            }

            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const count = await store.count();

            return count === 0 ? 'empty' : 'populated';
        } catch (err) {
            logger.error('Error on DB check:', err);
            return 'not-found';
        }
    }

    async function _exists(storeName: StoreNames<T>): Promise<boolean> {
        const res = await _state(storeName);
        return !(res === 'not-found');
    }

    async function _isPopulated(storeName: StoreNames<T>): Promise<boolean> {
        const res = await _state(storeName);
        return res === 'populated';
    }

    async function _clearStore(storeName: StoreNames<T>) {
        const db = await _get();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.clear();
        await tx.done;
        _notifyChange({ type: 'clearStore', store: storeName });
    }

    function _deleteDb(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(dbName);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
            request.onblocked = () => console.warn('Delete blocked: close all tabs.');
        });
    }

    async function _getAllKeys(storeName: StoreNames<T>): Promise<StoreKey<T, StoreNames<T>>[]> {
        const db = await _get();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        return await store.getAllKeys();
    }

    async function _findByField(
        storeName: StoreNames<T>,
        field: IndexNames<T, StoreNames<T>>,
        value: any
    ): Promise<StoreValue<T, StoreNames<T>>[]> {
        const db = await _get();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);

        if (!store.indexNames.contains(field)) {
            throw new Error(`Index "${String(field)}" does not exist`);
        }

        const index = store.index(field);
        return await index.getAll(value);
    }



    async function _delete(storeName: StoreNames<T>, keys: StoreKey<T, StoreNames<T>>[]) {
        const db = await _get();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        for (const key of keys) {
            await store.delete(key);
        }
        await tx.done;
        _notifyChange({ type: 'delete', store: storeName, keys });
    }

    async function _put(storeName: StoreNames<T>, doc: StoreValue<T, StoreNames<T>>) {
        const db = await _get();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(doc);
        await tx.done;
        _notifyChange({ type: 'put', store: storeName, doc });
    }

    async function _bulkPut(storeName: StoreNames<T>, docs: StoreValue<T, StoreNames<T>>[]) {
        const db = await _get();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        for (const doc of docs) {
            await store.put(doc);
        }
        await tx.done;
        _notifyChange({ type: 'bulkPut', store: storeName, count: docs.length });
    }

    const channel = new BroadcastChannel('indexeddb-sync');

    function _onChange(callback: (payload: any) => void) {
        channel.onmessage = (event) => {
            callback(event.data);
        };
    }

    function _notifyChange(payload: any) {
        channel.postMessage(payload);
    }

    async function _paginate(storeName: StoreNames<T>, limit: number, offset: number): Promise<T[]> {
        const db = await _get();
        const tx = db.transaction(storeName);
        const store = tx.objectStore(storeName);

        const results: T[] = [];
        let skipped = 0;

        const cursor = await store.openCursor();

        while (cursor && results.length < limit) {
            if (skipped < offset) {
                skipped++;
                await cursor.continue();
                continue;
            }

            results.push(cursor.value as T);
            await cursor.continue();
        }

        return results;
    }

    const endpoints = {
        get: _get,
        state: _state,
        delete: _delete,
        exists: _exists,
        isPopulated: _isPopulated,
        put: _put,
        bulkPut: _bulkPut,
        findByField: _findByField,
        getAllKeys: _getAllKeys,
        notifyChange: _notifyChange,
        onChange: _onChange,
        deleteDb: _deleteDb,
        clearStore: _clearStore,
        paginate: _paginate
    };

    return endpoints;
}
