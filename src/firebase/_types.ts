import type { Auth, User } from 'firebase/auth';
import type { Firestore, Timestamp } from 'firebase/firestore';
import type { FirebaseAuthMethods } from './auth/_types';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { FirebaseStorage } from 'firebase/storage';
import { FStoreDoc, FStoreUser } from './firestore/_types';
import { StorageMethodsInterface } from './storage';
import { Functions, HttpsCallable, HttpsCallableOptions, HttpsCallableResult } from 'firebase/functions';
export {type AuthState} from "./auth"

/**
 * The collection names in your firestore
 */
export type Collections = string;

export type CoreDocFields<T> = T & {
	id?: string;
	hash?: string; //changes on every document change and is a hash of the doc id and lastModified fields
	createdAt: Timestamp;
	deleted?: boolean;
	ttlAt?: Timestamp;
}

/**
 * Custom fields common to all NON user documents
 */
export type DocBlueprint<T> = T & CoreDocFields<{
	ownerId?: string;
	createdBy?: string;
	[key: string]: unknown;
}>;

/**
 * Custom fields common to all NON user documents
 */
export type SubcolelctionDocBlueprint<T> = T & CoreDocFields<{
	parentId?: string;
	[key: string]: unknown;
}>;

/**
 * This is only the custom user document
 */
export type AppUserDoc = CoreDocFields<{
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
export type AppUser = User & AppUserDoc;


export type MetadataSubDocStatus = CoreDocFields<{
	lastModified?: Timestamp;
	hash: string; //changes on every document change and is a hash of the doc id and lastModified fields
	[key: string]: unknown;
}>


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
	customClaims?: Record<string, any>; // Admin SDK only
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
	currentUser?: FirebaseAuthMethods & {doc?: FStoreUser};
	storage?: StorageMethodsInterface;
	instances: { app: FirebaseApp } & FirebaseServiceIstances;
};

export type ExtendedFirebaseOptions = FirebaseOptions & {
    /**
     * To use for Firebase functions initialization
     * one of: a) The region the callable functions are located in (ex: us-central1) b) A custom domain hosting the callable functions (ex: https://mydomain.com)
     */
    regionOrCustomDomain?: string;
}

export type FirebaseInitializationContext = {
	app: FirebaseApp;
	auth: Auth;
	firestore: Firestore;
	storage?: FirebaseStorage;
	client: FirebaseClient;
	functions: {
		get: () => Functions | null | undefined;
		callable: (functionName: string, options?: HttpsCallableOptions) => HttpsCallable<unknown, unknown, unknown> | null;
	}
  };