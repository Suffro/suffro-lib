import type { Auth, User } from 'firebase/auth';
import type { Firestore, Timestamp } from 'firebase/firestore';
import type { FirebaseAuthMethods } from './auth/_types';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { FirebaseStorage } from 'firebase/storage';
import { FStoreDoc, FStoreUser } from './firestore/_types';
import { StorageMethodsInterface } from './storage';
import { HttpsCallableOptions, HttpsCallableResult } from 'firebase/functions';
export { type AuthState } from "./auth";
export type Collections = string;
export type DocBlueprint<T> = T & {
    id: string;
    hash: string;
    createdAt: Timestamp;
    deleted?: boolean;
    [key: string]: unknown;
};
export type AppUserDoc = {
    locale: string;
    timeZone: string;
    email: string;
    availableBuilds: number;
    enabled: boolean;
    displayName?: string;
    role: 'standard' | 'admin';
};
export type AppUser = DocBlueprint<User & AppUserDoc>;
export type MetadataSubDocStatus = {
    lastModified?: Timestamp;
    hash: string;
    [key: string]: unknown;
};
export type FirebaseUserPublicData = {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerData: {
        providerId: string;
        uid: string;
        displayName: string | null;
        email: string | null;
        phoneNumber: string | null;
        photoURL: string | null;
    }[];
    metadata: {
        creationTime: string;
        lastSignInTime: string;
    };
    tenantId: string | null;
};
export type FirebaseUserSensitiveData = {
    email: string | null;
    phoneNumber: string | null;
    emailVerified: boolean;
    customClaims?: Record<string, any>;
};
export type FirebaseUserData = FirebaseUserPublicData & FirebaseUserSensitiveData;
export type FirebaseServiceIstances = {
    auth?: Auth;
    firestore?: Firestore;
    storage?: FirebaseStorage;
    analytics?: any;
};
export type FirebaseClient = {
    firestore?: FStoreDoc;
    currentUser?: FirebaseAuthMethods & {
        doc?: FStoreUser;
    };
    storage?: StorageMethodsInterface;
    instances: {
        app: FirebaseApp;
    } & FirebaseServiceIstances;
};
export type ExtendedFirebaseOptions = FirebaseOptions & {
    regionOrCustomDomain?: string;
};
export type FirebaseInitializationContext = {
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    storage?: FirebaseStorage;
    client: FirebaseClient;
    callableFunction?: (name: string, data?: any, regionOrCustomDomain?: string, options?: HttpsCallableOptions) => Promise<HttpsCallableResult<unknown> | null>;
};
//# sourceMappingURL=_types.d.ts.map