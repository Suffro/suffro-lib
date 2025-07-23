import type { WhereFilterOp } from 'firebase/firestore';
import type { AppUser, Collections, FirebaseUserPublicData } from '../_types';
import type { Auth, User } from 'firebase/auth';

export type FStoreUser = {
	doc: {
		set: (
			auth: Auth,
			data: Record<string, any> | AppUser,
			opts?: {
				merge?: boolean;
				id?: string;
			}
		) => Promise<void>;
		get: (auth: Auth) => Promise<AppUser>;
	};
	set: {
		profile: (auth: Auth, data: FirebaseUserPublicData) => Promise<void>;
		phoneNumber: (auth: Auth, phoneNumber: string) => Promise<void>;
	};
	get: (auth: Auth) => User;

	reauthenticate: (auth: Auth, email: string, currentPassword: string) => Promise<void>;
	changePassword: (auth: Auth, newPassword: string) => Promise<void>;
	changeEmail: (auth: Auth, newEmail: string) => Promise<void>;
};

export type FStoreDoc = {
	create: <T>(auth: Auth, collectionName: Collections, data: T) => Promise<string>;
	update: <T>(collectionName: Collections, id: string, data: Partial<T>) => Promise<string>;
	set: <T>(collectionName: Collections, id: string, data: Partial<T>) => Promise<string>;
	get: <T>(
		collectionName: Collections,
		id: string
	) => Promise<
		| (T & {
				id: string;
		  })
		| null
	>;
	remove: (collection: Collections, id: string) => Promise<string>;
	removeWhere: (
		collectionName: Collections,
		conditions: [string, WhereFilterOp, any][]
	) => Promise<string[]>;
};

export type FStore = {
	doc: FStoreDoc;
	user: FStoreUser;
};
