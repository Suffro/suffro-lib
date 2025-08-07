import type { Firestore, WhereFilterOp } from 'firebase/firestore';
import type { AppUser, Collections, FirebaseUserPublicData } from '../_types';
import type { Auth, User } from 'firebase/auth';

export type FStoreUser = {
	set: (
		data: Record<string, any> | AppUser,
		opts?: {
			merge?: boolean;
			id?: string;
		}
	) => Promise<void>;
	get: () => Promise<AppUser>;
};

export type FStoreDoc = {
	create: <T>(collectionName: Collections, data: T) => Promise<string>;
	update: <T>(collectionName: Collections, id: string, data: Partial<T>) => Promise<string>;
	set: <T>(collectionName: Collections, id: string, data: Partial<T>) => Promise<string>;
	get: <T>(collectionName: Collections, id: string) => Promise<(string & {
		id: string;
	}) | null>;
	list: (collectionName: Collections, conditions?: [string, WhereFilterOp, any]) => Promise<any[]>;
	remove: (collection: Collections, id: string) => Promise<string>;
	removeWhere: (
		collectionName: Collections,
		conditions: [string, WhereFilterOp, any][]
	) => Promise<string[]>;
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
	}
	users: {
		create: <T>(data: T) => Promise<string>;
		update: <T>(id: string, data: Partial<T>) => Promise<string>;
		set: <T>(id: string, data: Partial<T>) => Promise<string>;
		get: <T>(id: string) => Promise<(string & {
			id: string;
		}) | null>;
		remove: (id: string) => Promise<string>;
		removeWhere: (
			conditions: [string, WhereFilterOp, any][]
		) => Promise<string[]>;
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
		}
	}
};

export type FStore = {
	doc: FStoreDoc;
	userDoc: FStoreUser;
};
