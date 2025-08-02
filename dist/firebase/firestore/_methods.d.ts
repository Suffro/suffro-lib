import { type WhereFilterOp, Firestore } from "firebase/firestore";
import { type AppUser, type Collections, type FirebaseUserPublicData } from "../";
import { type User, type Auth } from "firebase/auth";
import type { FStoreDoc, FStoreUser } from "./_types";
export declare function _getDoc<T>(db: Firestore, collectionName: string, id: string): Promise<(T & {
    id: string;
}) | null>;
export declare function create<T>(auth: Auth, db: Firestore, collectionName: Collections, data: T): Promise<string>;
export declare function update<T>(db: Firestore, collectionName: Collections, id: string, data: Partial<T>): Promise<string>;
export declare function set<T>(db: Firestore, collectionName: Collections, id: string, data: Partial<T>): Promise<string>;
export declare function get<T>(db: Firestore, collectionName: Collections, id: string): Promise<(T & {
    id: string;
}) | null>;
export declare function remove(db: Firestore, collection: Collections, id: string): Promise<string>;
export declare function removeWhere(db: Firestore, collectionName: Collections, conditions: [string, WhereFilterOp, any][]): Promise<string[]>;
export declare function appUserSet(auth: Auth, db: Firestore, data: Record<string, any> | AppUser, opts?: {
    merge?: boolean;
    id?: string;
}): Promise<void>;
export declare function appUserGet(auth: Auth, db: Firestore): Promise<AppUser>;
export declare function userGet(auth: Auth): User;
export declare function userProfileSet(auth: Auth, data: FirebaseUserPublicData): Promise<void>;
export declare function updateUserPhoneNumber(auth: Auth, db: Firestore, phoneNumber: string): Promise<void>;
export declare const initFirestoreDocsMethods: (auth: Auth, db: Firestore, usersCollectionName?: string) => FStoreDoc;
export declare const initFirestoreCurrentUserDocMethods: (auth: Auth, db: Firestore) => FStoreUser;
