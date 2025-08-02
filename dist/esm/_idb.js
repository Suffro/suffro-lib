import { openDB } from 'idb';
import { logger } from './_logger';
export async function idb(dbName, version, storeDefs) {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
        console.error('[IDB] IndexedDB is not available in this context.');
        return null;
    }
    const DB_INSTANCE = await openDB(dbName, version, {
        upgrade(db) {
            if (!storeDefs)
                return;
            for (const [storeName, schema] of Object.entries(storeDefs)) {
                if (!db.objectStoreNames.contains(storeName)) {
                    const store = db.createObjectStore(storeName, {
                        keyPath: schema.keyPath ?? 'id'
                    });
                    if (schema.indices) {
                        for (const index of schema.indices) {
                            store.createIndex(index.name, index.keyPath, index.options);
                        }
                    }
                }
            }
        }
    });
    async function _get() {
        return DB_INSTANCE;
    }
    async function _state(storeName) {
        try {
            const db = await _get();
            if (!db.objectStoreNames.contains(storeName)) {
                return 'not-found';
            }
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const count = await store.count();
            return count === 0 ? 'empty' : 'populated';
        }
        catch (err) {
            logger.error('Error on DB check:', err);
            return 'not-found';
        }
    }
    async function _exists(storeName) {
        const res = await _state(storeName);
        return !(res === 'not-found');
    }
    async function _isPopulated(storeName) {
        const res = await _state(storeName);
        return res === 'populated';
    }
    async function _clearStore(storeName) {
        const db = await _get();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.clear();
        await tx.done;
        _notifyChange({ type: 'clearStore', store: storeName });
    }
    function _deleteDb() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(dbName);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
            request.onblocked = () => console.warn('Delete blocked: close all tabs.');
        });
    }
    async function _getAllKeys(storeName) {
        const db = await _get();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        return await store.getAllKeys();
    }
    async function _findByField(storeName, field, value) {
        const db = await _get();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        if (!store.indexNames.contains(field)) {
            throw new Error(`Index "${String(field)}" does not exist`);
        }
        const index = store.index(field);
        return await index.getAll(value);
    }
    async function _delete(storeName, keys) {
        const db = await _get();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        for (const key of keys) {
            await store.delete(key);
        }
        await tx.done;
        _notifyChange({ type: 'delete', store: storeName, keys });
    }
    async function _put(storeName, doc) {
        const db = await _get();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(doc);
        await tx.done;
        _notifyChange({ type: 'put', store: storeName, doc });
    }
    async function _bulkPut(storeName, docs) {
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
    function _onChange(callback) {
        channel.onmessage = (event) => {
            callback(event.data);
        };
    }
    function _notifyChange(payload) {
        channel.postMessage(payload);
    }
    async function _paginate(storeName, limit, offset) {
        const db = await _get();
        const tx = db.transaction(storeName);
        const store = tx.objectStore(storeName);
        const results = [];
        let skipped = 0;
        const cursor = await store.openCursor();
        while (cursor && results.length < limit) {
            if (skipped < offset) {
                skipped++;
                await cursor.continue();
                continue;
            }
            results.push(cursor.value);
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
