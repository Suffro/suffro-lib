import type { Auth, User } from 'firebase/auth';
import type { Firestore, Timestamp } from 'firebase/firestore';
import type { FirebaseAuthMethods } from './auth/_types';
import type { FirebaseApp } from 'firebase/app';
import type { FirebaseStorage } from 'firebase/storage';
import { FStoreDoc, FStoreUser } from './firestore/_types';
import { StorageMethodsInterface } from './storage';
/**
 * The collection names in your firestore
 */
export type Collections = string;
/**
 * Custom fields common to all documents
 */
export type DocBlueprint<T> = T & {
    id: string;
    hash: string;
    createdAt: Timestamp;
    deleted?: boolean;
    [key: string]: unknown;
};
/**
 * This is only the custom user document
 */
export type AppUserDoc = {
    locale: string;
    timeZone: string;
    email: string;
    availableBuilds: number;
    enabled: boolean;
    displayName?: string;
    role: 'standard' | 'admin';
};
/**
 * This is the complete user with fields from the custom user document, the built in Firebase user and the custom fields common to all documents
 */
export type AppUser = DocBlueprint<User & AppUserDoc>;
export type MetadataSubDocStatus = {
    lastModified?: Timestamp;
    hash: string;
    [key: string]: unknown;
};
/**
 * This is an utility type that holds various public fields present in the built in Firebase user
 */
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
/**
 * This is an utility type that holds various sensitive fields present in the built in Firebase user
 */
export type FirebaseUserSensitiveData = {
    email: string | null;
    phoneNumber: string | null;
    emailVerified: boolean;
    customClaims?: Record<string, any>;
};
/**
 * This is an utility type that holds various sensitive and public fields present in the built in Firebase user
 */
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
export type FirebaseInitializationContext = {
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    storage?: FirebaseStorage;
    client: FirebaseClient;
};
