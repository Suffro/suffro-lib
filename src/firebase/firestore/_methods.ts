import {
  doc,
  setDoc,
  updateDoc,
  Timestamp,
  getDoc,
  deleteDoc,
  collection,
  DocumentReference,
  type DocumentData,
  query,
  where,
  getDocs,
  type WhereFilterOp,
  serverTimestamp,
  Firestore,
  addDoc,
} from "firebase/firestore";
import {
  getRecaptchaVerifier,
  type AppUser,
  type Collections,
  type FirebaseUserPublicData,
} from "../";
import { logger } from "../../";
import { validate } from "../../";
import {
  updateEmail,
  updatePassword,
  PhoneAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential,
  linkWithCredential,
  type User,
  updateProfile,
  type Auth,
} from "firebase/auth";
import type { FStore, FStoreDoc, FStoreUser } from "./_types";
import { cryptoTools } from "../../_crypto";

const _userCollectionRestriction = (collectionName: Collections) => {
  if (collectionName === "users")
    throw new Error("Do NOT use this function for the user doc");
};
const _getFsUser = (auth: Auth): User => {
  if (!auth?.currentUser) throw new Error("User not found");
  return auth.currentUser;
};

export async function _getDoc<T>(
  db: Firestore,
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  logger.logCaller();
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T & { id: string };
}

/** 
 * (set doc senza merge, genera l'id prima di crearlo)
 * @returns Restituisce l'id del documento creato
 */
export async function create<T>(
  auth: Auth,
  db: Firestore,
  collectionName: Collections,
  data: T
): Promise<string> {
  logger.logCaller();
  _userCollectionRestriction(collectionName);
  const date: Date = new Date();
  const createdAt = Timestamp.fromDate(date);
  const preRef = doc(collection(db, collectionName)); // genera un nuovo doc ID dentro la collection
  const raw = `${preRef.id}_${createdAt.toMillis()}`;
  // Calcola hash SHA256
  const hash = cryptoTools.digest.digestHex(raw,"SHA-256");

  await setDoc(preRef, {
    id: preRef.id,
    hash,
    locale: navigator?.language || (await appUserGet(auth, db))?.locale,
    createdAt,
    lastModified: createdAt,
    ...data,
  });
  return preRef.id;
}

/**
 * @returns Restituisce l'id del documento
 */
export async function update<T>(
  db: Firestore,
  collectionName: Collections,
  id: string,
  data: Partial<T>
): Promise<string> {
  logger.logCaller();
  _userCollectionRestriction(collectionName);
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const date: Date = new Date();
  const lastModified = Timestamp.fromDate(date);
  const preRef = doc(collection(db, collectionName)); // genera un nuovo doc ID dentro la collection
  const raw = `${id}_${lastModified.toMillis()}`;
  // Calcola hash SHA256
  const hash = cryptoTools.digest.digestHex(raw,"SHA-256");
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    hash,
    lastModified
  });
  return id;
}


/**
 * @returns Restituisce l'id del documento
 */
export async function set<T>(
  db: Firestore,
  collectionName: Collections,
  id: string,
  data: Partial<T>
): Promise<string> {
  _userCollectionRestriction(collectionName);
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const date: Date = new Date();
  const lastModified = Timestamp.fromDate(date);
  const preRef = doc(collection(db, collectionName)); // genera un nuovo doc ID dentro la collection
  const raw = `${id}_${lastModified.toMillis()}`;
  // Calcola hash SHA256
  const hash = cryptoTools.digest.digestHex(raw,"SHA-256");
  await setDoc(doc(db, collectionName, id), {
    ...data,
    id,
    hash,
    lastModified
  }, {merge: true});
  return id;
}

/**
 * @param collectionName Il nome della collection del documento
 * @param id L'id del documento
 * @returns Restituisce i dati del documento se esiste, altrimenti null
 */
export async function get<T>(
  db: Firestore,
  collectionName: Collections,
  id: string
): Promise<(T & { id: string }) | null> {
  logger.logCaller();
  _userCollectionRestriction(collectionName);
  return await _getDoc(db, collectionName, id);
}

export async function remove(
  db: Firestore,
  collection: Collections,
  id: string
): Promise<string> {
  logger.logCaller();
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const docRef = doc(db, collection, id);
  await deleteDoc(docRef);
  return id;
}

export async function removeWhere(
  db: Firestore,
  collectionName: Collections,
  conditions: [string, WhereFilterOp, any][]
): Promise<string[]> {
  logger.logCaller();
  const q = query(
    collection(db, collectionName),
    ...conditions.map(([field, op, value]) => where(field, op, value))
  );
  const snapshot = await getDocs(q);
  const deletions = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
  await Promise.all(deletions);
  return snapshot.docs.map((docSnap) => docSnap.id);
}

export async function createInSubcollection<T>(
  db: Firestore,
  parentCollection: Collections,
  parentId: string,
  subcollection: string,
  data: T,
  isUser?: boolean
): Promise<string> {
  logger.logCaller();
  if (!validate.string(parentId)) throw new Error("Missing parent document ID.");
  if(!isUser) _userCollectionRestriction(parentCollection);
  const subRef = collection(db, parentCollection, parentId, subcollection);
  const preRef = doc(subRef);
  const createdAt = Timestamp.fromDate(new Date());
  const raw = `${preRef.id}_${createdAt.toMillis()}`;
  // Calcola hash SHA256
  const hash = cryptoTools.digest.digestHex(raw,"SHA-256");
  await setDoc(preRef, {
    ...data,
    id: preRef.id,
    hash,
    createdAt
  });
  return preRef.id;
}

export async function setInSubcollection<T>(
  db: Firestore,
  parentCollection: Collections,
  parentId: string,
  subcollection: string,
  docId: string,
  data: Partial<T>,
  isUser?: boolean
): Promise<string> {
  logger.logCaller();
  if (!validate.string(parentId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  if(!isUser) _userCollectionRestriction(parentCollection);
  const ref = doc(db, parentCollection, parentId, subcollection, docId);
  const lastModified = Timestamp.fromDate(new Date());
  const raw = `${docId}_${lastModified.toMillis()}`;
  // Calcola hash SHA256
  const hash = cryptoTools.digest.digestHex(raw,"SHA-256");
  await setDoc(ref, {
    ...data,
    id: docId,
    hash,
    lastModified
  }, { merge: true });
  return docId;
}

export async function getFromSubcollection<T>(
  db: Firestore,
  parentCollection: Collections,
  parentId: string,
  subcollection: string,
  docId: string,
  isUser?: boolean
): Promise<(T & { id: string }) | null> {
  logger.logCaller();
  if (!validate.string(parentId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  if(!isUser) _userCollectionRestriction(parentCollection);
  const ref = doc(db, parentCollection, parentId, subcollection, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T & { id: string };
}

export async function listFromSubcollection<T>(
  db: Firestore,
  parentCollection: Collections,
  parentId: string,
  subcollection: string,
  isUser?: boolean
): Promise<(T & { id: string })[]> {
  logger.logCaller();
  if (!validate.string(parentId))
    throw new Error("Missing parent document ID.");
  if(!isUser) _userCollectionRestriction(parentCollection);
  const colRef = collection(db, parentCollection, parentId, subcollection);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as (T & { id: string })[];
}

export async function removeFromSubcollection(
  db: Firestore,
  parentCollection: Collections,
  parentId: string,
  subcollection: string,
  docId: string,
  isUser?: boolean
): Promise<string> {
  logger.logCaller();
  if (!validate.string(parentId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  if(!isUser) _userCollectionRestriction(parentCollection);
  const ref = doc(db, parentCollection, parentId, subcollection, docId);
  await deleteDoc(ref);
  return docId;
}



///////////// users collection functions /////////////

export async function appUserSet(
  auth: Auth,
  db: Firestore,
  data: Record<string, any> | AppUser,
  opts: { merge?: boolean; id?: string } = { merge: true }
) {
  logger.logCaller();
  const user = _getFsUser(auth);
  const { merge, id } = opts;
  const userId: string = id ?? (user?.uid as string);

  if (!validate.string(userId))
    throw new Error("Could not find User or its uid.");
  await setDoc(
    doc(db, "users", userId),
    {
      ...data,
      displayName: data?.displayName ?? user.displayName,
    },
    { merge }
  );
}

export async function appUserGet(auth: Auth, db: Firestore): Promise<AppUser> {
  logger.logCaller();
  const userId: string = auth.currentUser?.uid as string;
  if (!validate.string(userId))
    throw new Error("Could not find User or its uid.");
  const userData = await _getDoc(db, "users", userId);
  if (!userData) logger.warn("⚠️ No user document found.");
  return userData as AppUser;
}

export async function appUserCreateInSubcollection<T>(
  db: Firestore,
  userId: string,
  subcollection: string,
  data: T
): Promise<string> {
  logger.logCaller();
  if (!validate.string(userId)) throw new Error("Missing user document ID.");
  const id = await createInSubcollection(db,"users",userId,subcollection, data, true);
  return id;
}

export async function appUserSetInSubcollection<T>(
  db: Firestore,
  userId: string,
  subcollection: string,
  docId: string,
  data: Partial<T>
): Promise<string> {
  logger.logCaller();
  if (!validate.string(userId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  await setInSubcollection(db,"users",userId,subcollection,docId, data, true);
  return docId;
}

export async function appUserGetFromSubcollection<T>(
  db: Firestore,
  userId: string,
  subcollection: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  logger.logCaller();
  if (!validate.string(userId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  const res = await getFromSubcollection(db,"users",userId,subcollection,docId, true);
  return res as (T & { id: string } | null);
}

export async function appUserListFromSubcollection<T>(
  db: Firestore,
  userId: string,
  subcollection: string
): Promise<(T & { id: string })[]> {
  logger.logCaller();
  if (!validate.string(userId))
    throw new Error("Missing parent document ID.");
    const res = await listFromSubcollection(db,"users",userId,subcollection, true);
    return res as (T & { id: string })[];
}

export async function appUserRemoveFromSubcollection(
  db: Firestore,
  userId: string,
  subcollection: string,
  docId: string
): Promise<string> {
  logger.logCaller();
  if (!validate.string(userId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  await removeFromSubcollection(db,"users",userId,subcollection,docId, true);
  return docId;
}

///////////// firestore user functions /////////////

export function userGet(auth: Auth): User {
  logger.logCaller();
  const user = _getFsUser(auth);
  return user;
}

export async function userProfileSet(auth: Auth, data: FirebaseUserPublicData) {
  logger.logCaller();
  const user = _getFsUser(auth);
  await updateProfile(user, data);
}

// --- Update Phone Number (requires verification) ---
export async function updateUserPhoneNumber(
  auth: Auth,
  db: Firestore,
  phoneNumber: string
) {
  logger.logCaller();
  const user = _getFsUser(auth);

  logger.log("Phone number verication initiated");
  const provider = new PhoneAuthProvider(auth);
  const recaptchaVerifier = await getRecaptchaVerifier(auth);
  logger.log("reCapthca verifier retreived");
  const verificationId = await provider.verifyPhoneNumber(
    phoneNumber,
    recaptchaVerifier
  );
  logger.log("Verification ID retreived");

  // Prompt user to enter the verification code sent to their phone
  logger.log("Prompting verification code input");
  const verificationCode = window.prompt(
    "Inserisci il codice di verifica inviato al tuo numero:"
  );

  if (!verificationCode) {
    const errorMessage = "Codice di verifica errato o mancante";
    logger.error(errorMessage);
    return;
  }

  const credential = PhoneAuthProvider.credential(
    verificationId,
    verificationCode
  );
  await linkWithCredential(user, credential);
  await appUserSet(auth, db, { phoneNumber });
}

/**
 * DISABLED
 *
export const initUserDoc = async (auth: Auth, user: User) => {
  return;
	logger.logCaller();
	const userDoc = await appUserGet(auth);
	if(userDoc) return logger.log("✔️ User doc already initiated");
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const uid: string = user.uid;
	await appUserSet(
		{
			role: 'standard',
			enabled: true,
			id: uid,
			displayName: user.displayName,
			phoneNumber: user.phoneNumber,
			email: user.email,
			createdAt: serverTimestamp(),
			locale: navigator.language,
			timeZone
		} as AppUser,
		{ id: uid }
	);
	logger.log('✅ User doc initiated');
}
*/

// const firestoreDocs = {create,update,set,get,remove,removeWhere};

// const _fstore: FStore = {
//   doc: {
//     ...firestoreDocs
//   },
//   user: {
//     doc: {
//       set: appUserSet,
//       get: appUserGet
//     },
//     set: {
//       profile: userProfileSet,
//       phoneNumber: updateUserPhoneNumber
//     },
//     get: userGet,
//     reauthenticate: reauthenticateUser,
//     changeEmail: updateUserEmail,
//     changePassword: updateUserPassword
//   }
// }

export const initFirestoreDocsMethods = (
  auth: Auth,
  db: Firestore,
  usersCollectionName: string = "users"
): FStoreDoc => ({
  create: async function _create(
    collectionName: Collections,
    data: unknown
  ): Promise<string> {
    return await create(auth, db, collectionName, data);
  },
  update: async function _update(
    collectionName: Collections,
    id: string,
    data: Partial<unknown>
  ): Promise<string> {
    return await update(db, collectionName, id, data);
  },
  set: async function _set(
    collectionName: Collections,
    id: string,
    data: Partial<unknown>
  ): Promise<string> {
    return await set(db, collectionName, id, data);
  },
  get: async function _get(
    collectionName: Collections,
    id: string
  ): Promise<(string & { id: string }) | null> {
    return await get(db, collectionName, id);
  },
  remove: async function _remove(
    collectionName: Collections,
    id: string
  ): Promise<string> {
    return await remove(db, collectionName, id);
  },
  removeWhere: async function _removeWhere(
    collectionName: Collections,
    conditions: [string, WhereFilterOp, any][]
  ): Promise<string[]> {
    return await removeWhere(db, collectionName, conditions);
  },
  subcollections: {
    create: async function _create(parentCollection: Collections, parentId: string, subcollection: string, data: any): Promise<string> {
      const res = await createInSubcollection(db, parentCollection, parentId, subcollection, data);
      return res;
    },
    set: async function _set(parentCollection: Collections, parentId: string, subcollection: string, docId: string, data: any): Promise<string> {
      const res = await setInSubcollection(db, parentCollection, parentId, subcollection, docId, data);
      return res;
    },
    get: async function _get(parentCollection: Collections, parentId: string, subcollection: string, docId: string): Promise<{
      id: string;
  } | null> {
      const res = await getFromSubcollection(db, parentCollection, parentId, subcollection, docId);
      return res;
    },
    list: async function _list(parentCollection: Collections, parentId: string, subcollection: string): Promise<{
      id: string;
    }[]> {
      const res = await listFromSubcollection(db, parentCollection, parentId, subcollection,);
      return res;
    },
    remove: async function _remove(parentCollection: Collections, parentId: string, subcollection: string, docId: string): Promise<string> {
      const res = await removeFromSubcollection(db, parentCollection, parentId, subcollection, docId);
      return res;
    }
  },
  users: {
    create: async function _create(
      data: unknown
    ): Promise<string> {
      return await create(auth, db, usersCollectionName, data);
    },
    update: async function _update(
      id: string,
      data: Partial<unknown>
    ): Promise<string> {
      return await update(db, usersCollectionName, id, data);
    },
    set: async function _set(
      id: string,
      data: Partial<unknown>
    ): Promise<string> {
      return await set(db, usersCollectionName, id, data);
    },
    get: async function _get(
      id: string
    ): Promise<(string & { id: string }) | null> {
      return await get(db, usersCollectionName, id);
    },
    remove: async function _remove(
      id: string
    ): Promise<string> {
      return await remove(db, usersCollectionName, id);
    },
    removeWhere: async function _removeWhere(
      conditions: [string, WhereFilterOp, any][]
    ): Promise<string[]> {
      return await removeWhere(db, usersCollectionName, conditions);
    },
    subcollections: {
      create: async function _create(userId: string, subcollection: string, data: any): Promise<string> {
        const res = await appUserCreateInSubcollection(db, userId, subcollection, data);
        return res;
      },
      set: async function _set(userId: string, subcollection: string, docId: string, data: any): Promise<string> {
        const res = await appUserSetInSubcollection(db, userId, subcollection, docId, data);
        return res;
      },
      get: async function _get(userId: string, subcollection: string, docId: string): Promise<{
        id: string;
    } | null> {
        const res = await appUserGetFromSubcollection(db, userId, subcollection, docId);
        return res;
      },
      list: async function _list(userId: string, subcollection: string): Promise<{
        id: string;
      }[]> {
        const res = await appUserListFromSubcollection(db, userId, subcollection);
        return res;
      },
      remove: async function _remove(userId: string, subcollection: string, docId: string): Promise<string> {
        const res = await appUserRemoveFromSubcollection(db, userId, subcollection, docId);
        return res;
      }
    }
  },
});

export const initFirestoreCurrentUserDocMethods = (
  auth: Auth,
  db: Firestore
): FStoreUser => ({
  set: async function _set(
    data: Record<string, any> | AppUser,
    opts?: { merge?: boolean; id?: string }
  ): Promise<void> {
    return await appUserSet(auth, db, data, opts);
  },
  get: async function _get(): Promise<AppUser> {
    return await appUserGet(auth, db);
  },
});
