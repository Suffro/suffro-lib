import * as firebase_auth from 'firebase/auth';
import { User, Auth, RecaptchaVerifier } from 'firebase/auth';
import { WhereFilterOp, Timestamp as Timestamp$1, FieldValue, Firestore } from 'firebase/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { FirebaseStorage } from 'firebase/storage';
import { Functions, HttpsCallableOptions, HttpsCallable } from 'firebase/functions';

type FirebaseAuthMethods = {
    get: () => User;
    signout: (options?: {
        redirectUrl?: string;
        reload?: boolean;
    }) => Promise<void>;
    signup: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
    signin: (email: string, password: string, remember: boolean) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    reauthenticate: (email: string, currentPassword: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    updateEmail: (newEmail: string) => Promise<void>;
    googleAuth: (withRedirect?: boolean) => Promise<void>;
    githubAuth: (withRedirect?: boolean) => Promise<void>;
    isLoggedIn: () => boolean;
};
type AuthState = {
    subscribe(callback: (user: User | null) => void): () => void;
    user(): User | null;
    logged(): boolean;
    get(): Auth;
};

type FStoreUser = {
    set: (data: Record<string, any> | AppUser, opts?: {
        merge?: boolean;
        id?: string;
    }) => Promise<void>;
    get: () => Promise<AppUser>;
};
type FStoreDoc = {
    create: <T>(collectionName: Collections, data: T) => Promise<string>;
    update: <T>(collectionName: Collections, id: string, data: Partial<T>) => Promise<string>;
    set: <T>(collectionName: Collections, id: string, data: Partial<T>) => Promise<string>;
    get: <T>(collectionName: Collections, id: string) => Promise<(string & {
        id: string;
    }) | null>;
    list: (collectionName: Collections, conditions?: [string, WhereFilterOp, any]) => Promise<any[]>;
    remove: (collection: Collections, id: string) => Promise<string>;
    removeWhere: (collectionName: Collections, conditions: [string, WhereFilterOp, any][]) => Promise<string[]>;
    subcollections: {
        create: (parentCollection: Collections, parentId: string, subcollection: string, data: any) => Promise<string>;
        set: (parentCollection: Collections, parentId: string, subcollection: string, docId: string, data: any) => Promise<string>;
        get: (parentCollection: Collections, parentId: string, subcollection: string, docId: string) => Promise<{
            id: string;
        } | null>;
        list: (parentCollection: Collections, parentId: string, subcollection: string) => Promise<{
            id: string;
        }[]>;
        remove: (parentCollection: Collections, parentId: string, subcollection: string, docId: string) => Promise<string>;
    };
    users: {
        create: <T>(data: T) => Promise<string>;
        update: <T>(id: string, data: Partial<T>) => Promise<string>;
        set: <T>(id: string, data: Partial<T>) => Promise<string>;
        get: <T>(id: string) => Promise<(string & {
            id: string;
        }) | null>;
        remove: (id: string) => Promise<string>;
        removeWhere: (conditions: [string, WhereFilterOp, any][]) => Promise<string[]>;
        subcollections: {
            create: (userId: string, subcollection: string, data: any) => Promise<string>;
            set: (userId: string, subcollection: string, docId: string, data: any) => Promise<string>;
            get: (userId: string, subcollection: string, docId: string) => Promise<{
                id: string;
            } | null>;
            list: (userId: string, subcollection: string) => Promise<{
                id: string;
            }[]>;
            remove: (userId: string, subcollection: string, docId: string) => Promise<string>;
        };
    };
};

type StorageMethodsInterface = {
    uploadFile: (file: File, fileName: string, folderSegments: string[]) => Promise<string>;
    deleteFile: (fileName: string, folderSegments: string[]) => Promise<void>;
    downloadFile: (fileName: string, folderSegments: string[]) => Promise<Blob>;
    getFileUrl: (fileName: string, folderSegments: string[]) => Promise<string>;
    listFiles: (folderSegments: string[]) => Promise<string[]>;
};

/**
 * Store reattivo per l’utente Firebase.
 * - subscribe(cb): si registra per ricevere aggiornamenti (via onAuthStateChanged)
 * - user(): restituisce lo stato corrente dell’utente (User | null)
 * - logged(): restituisce true se l'utente è loggato altrimenti false
 * - get(): Returns app auth instance
 */
declare function authStateObsverver(appAuth: ReturnType<typeof firebase_auth.getAuth>): AuthState;

type FirebaseTimestamp = Timestamp | Timestamp$1;
/**
 * The collection names in your firestore
 */
type Collections = string;
type CoreDocFields<T> = T & {
    id?: string;
    hash?: string;
    createdAt: FirebaseTimestamp | FieldValue;
    deleted?: boolean;
    ttlAt?: FirebaseTimestamp;
};
/**
 * Custom fields common to all NON user documents
 */
type DocBlueprint<T> = T & CoreDocFields<{
    ownerId?: string;
    createdBy?: string;
    [key: string]: unknown;
}>;
/**
 * Custom fields common to all NON user documents
 */
type SubcolelctionDocBlueprint<T> = T & CoreDocFields<{
    parentId?: string;
    [key: string]: unknown;
}>;
/**
 * This is only the custom user document
 */
type AppUserDoc = CoreDocFields<{
    locale: string;
    timeZone: string;
    email: string;
    enabled: boolean;
    displayName?: string;
    role: 'standard' | 'admin';
    [key: string]: unknown;
}>;
/**
 * This is the complete user with fields from the custom user document, the built in Firebase user and the custom fields common to all documents
 */
type AppUser = User & AppUserDoc;
type MetadataSubDocStatus = CoreDocFields<{
    lastModified?: FirebaseTimestamp;
    hash: string;
    [key: string]: unknown;
}>;
/**
 * This is an utility type that holds various public fields present in the built in Firebase user
 */
type FirebaseUserPublicData = {
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
type FirebaseUserSensitiveData = {
    email: string | null;
    phoneNumber: string | null;
    emailVerified: boolean;
    customClaims?: Record<string, any>;
};
/**
 * This is an utility type that holds various sensitive and public fields present in the built in Firebase user
 */
type FirebaseUserData = FirebaseUserPublicData & FirebaseUserSensitiveData;
type FirebaseServiceIstances = {
    auth?: Auth;
    firestore?: Firestore;
    storage?: FirebaseStorage;
    analytics?: any;
};
type FirebaseClient = {
    firestore?: FStoreDoc;
    currentUser?: FirebaseAuthMethods & {
        doc?: FStoreUser;
    };
    storage?: StorageMethodsInterface;
    instances: {
        app: FirebaseApp;
    } & FirebaseServiceIstances;
};
type ExtendedFirebaseOptions = FirebaseOptions & {
    /**
     * To use for Firebase functions initialization
     * one of: a) The region the callable functions are located in (ex: us-central1) b) A custom domain hosting the callable functions (ex: https://mydomain.com)
     */
    regionOrCustomDomain?: string;
};
type FirebaseInitializationContext = {
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    storage?: FirebaseStorage;
    client: FirebaseClient;
    functions: {
        get: () => Functions | null | undefined;
        callable: (functionName: string, options?: HttpsCallableOptions) => HttpsCallable<unknown, unknown, unknown> | null;
    };
};

declare function getRecaptchaVerifier(auth: Auth): Promise<RecaptchaVerifier>;

declare const initializeFirebaseClient: (services?: FirebaseServiceIstances) => FirebaseClient;

/**
 * Initializes and returns a fully configured Firebase instance.
 *
 * This utility function ensures that Firebase is initialized only once,
 * using the provided configuration. It returns the core Firebase services:
 * - Firebase App
 * - Authentication
 * - Firestore (with persistent multi-tab cache)
 * - Firebase Storage (only if a storageBucket is defined)
 * - 'callableFunction' (method that calls a Firebase "callable function" and returns the result)
 *
 * The function also includes optional console logs to help with debugging.
 *
 * @param configuration The Firebase configuration object (FirebaseOptions) plus Firebase region or your custom domain.
 * @param configuration.regionOrCustomDomain one of: a) The region the callable functions are located in (ex: us-central1) b) A custom domain hosting the callable functions (ex: https://mydomain.com) (optional but strongly recommended if it wasn't set with Firebase Context)
 * @param logs If true, logs each initialization step to the console (default: false).
 * @returns An object containing `app`, `auth`, `firestore`, and (optionally) `storage`.
 *
 * @throws If configuration is missing or Firebase was already initialized.
 *
 * @example
 * const firebaseContext = initializeFirebaseContext({
 *   apiKey: '...',
 *   authDomain: '...',
 *   projectId: '...',
 *   storageBucket: '...',
 *   regionOrCustomDomain: '...'
 * }, true);
 *
 * const auth = firebaseContext.auth;
 * const db = firebaseContext.firestore;
 *
 * const res = await firebaseContext.callableFunction(...);
 */
declare const initializeFirebaseContext: (configuration: ExtendedFirebaseOptions, logs?: boolean) => FirebaseInitializationContext;

export { type AppUser, type AppUserDoc, type AuthState, type Collections, type CoreDocFields, type DocBlueprint, type ExtendedFirebaseOptions, type FirebaseClient, type FirebaseInitializationContext, type FirebaseServiceIstances, type FirebaseTimestamp, type FirebaseUserData, type FirebaseUserPublicData, type FirebaseUserSensitiveData, type MetadataSubDocStatus, type SubcolelctionDocBlueprint, authStateObsverver, getRecaptchaVerifier, initializeFirebaseClient, initializeFirebaseContext };
