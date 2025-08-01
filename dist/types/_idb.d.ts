import { type IDBPDatabase, type IndexNames, type StoreKey, type StoreNames, type StoreValue } from 'idb';
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
export declare function idb<T = unknown>(dbName: string, version?: number, storeDefs?: StoreDefinition): Promise<IDBApi<T> | null>;
export {};
