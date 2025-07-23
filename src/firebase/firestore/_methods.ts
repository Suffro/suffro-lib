import { doc, setDoc, updateDoc, Timestamp, getDoc, deleteDoc, collection, DocumentReference, type DocumentData, query, where, getDocs, type WhereFilterOp, serverTimestamp, Firestore } from "firebase/firestore";
import { getRecaptchaVerifier, type AppUser, type Collections, type FirebaseUserPublicData } from "../";
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
  type Auth
} from "firebase/auth";
import type { FStore } from "./_types";

const _userCollectionRestriction = (collectionName: Collections) => {if(collectionName==="users") throw new Error("Do NOT use this function for the user doc")}
const _getFsUser = (auth: Auth): User => {
  if(!auth?.currentUser) throw new Error("User not found");
  return auth.currentUser;
};

export async function _getDoc<T>(db: Firestore, collectionName:string, id: string): Promise<(T & { id: string }) | null>  {
  if(!validate.string(id)) throw new Error("Missing document ID.");
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T & { id: string };
}

/**
 * @returns Restituisce l'id del documento creato 
 */
export async function create<T>(auth: Auth, db: Firestore, collectionName: Collections, data: T): Promise<string> {
  _userCollectionRestriction(collectionName);
  const date: Date = new Date();
  const preRef = doc(collection(db, collectionName)); // genera un nuovo doc ID dentro la collection
  await setDoc(preRef, {
    id: preRef.id,
    locale: navigator?.language || (await appUserGet(auth, db))?.locale,
    createdAt: Timestamp.fromDate(date),
    ...data
  });
  return preRef.id;
}

/**
 * @returns Restituisce l'id del documento 
 */
export async function update<T>(db: Firestore, collectionName: Collections, id: string, data: Partial<T>): Promise<string> {
  _userCollectionRestriction(collectionName);
  if(!validate.string(id)) throw new Error("Missing document ID.");
  const date: Date = new Date();
  await updateDoc(doc(db, collectionName, id), {
    ...data
  });
  return id;
}

/**
 * @returns Restituisce l'id del documento 
 */
export async function set<T>(db: Firestore, collectionName: Collections, id: string, data: Partial<T>): Promise<string> {
  _userCollectionRestriction(collectionName);
  if(!validate.string(id)) throw new Error("Missing document ID.");
  const date: Date = new Date();
  await setDoc(doc(db, collectionName, id), {
    ...data,
    id
  });
  return id;
}


/**
 * @param collectionName Il nome della collection del documento
 * @param id L'id del documento
 * @returns Restituisce i dati del documento se esiste, altrimenti null
 */
export async function get<T>(db: Firestore, collectionName: Collections, id: string): Promise<(T & { id: string }) | null> {
  _userCollectionRestriction(collectionName);
  return await _getDoc(db, collectionName,id);
}

export async function remove(db: Firestore, collection: Collections, id: string): Promise<string> {
  if(!validate.string(id)) throw new Error("Missing document ID.");
  const docRef = doc(db, collection, id);
  await deleteDoc(docRef);
  return id;
}

export async function removeWhere(
  db: Firestore,
  collectionName: Collections,
  conditions: [string, WhereFilterOp, any][]
): Promise<string[]> {
  const q = query(
    collection(db, collectionName),
    ...conditions.map(([field, op, value]) => where(field, op, value))
  );
  const snapshot = await getDocs(q);
  const deletions = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
  await Promise.all(deletions);
  return snapshot.docs.map(docSnap => docSnap.id);
}



///////////// users collection functions /////////////

export async function appUserSet(auth: Auth, db: Firestore, data: Record<string, any> | AppUser, opts:{merge?:boolean;id?:string}={merge:true}){
  const user = _getFsUser(auth);
  const {merge, id} = opts;
  const userId: string = id ?? (user?.uid as string);
  
  if (!validate.string(userId)) throw new Error("Could not find User or its uid.");
   await setDoc(
    doc(db, 'users', userId),
    {
      ...data,
      displayName: (data?.displayName) ?? user.displayName
    },
    { merge }
  );
}

export async function appUserGet(auth: Auth, db: Firestore): Promise<AppUser>{
  logger.logCaller();
  const userId: string = auth.currentUser?.uid as string;
  if (!validate.string(userId)) throw new Error("Could not find User or its uid.");
  const userData = await _getDoc(db, "users",userId);
  if(!userData) logger.warn("⚠️ No user document found.");
  return userData as AppUser;
}


///////////// firestore user functions /////////////

export function userGet(auth: Auth): User {
  const user = _getFsUser(auth);
  return user;
}

export async function userProfileSet(auth: Auth, data: FirebaseUserPublicData){
  const user = _getFsUser(auth);
  await updateProfile(user, data);
}

// --- Update Phone Number (requires verification) ---
export async function updateUserPhoneNumber(
  auth: Auth,
  db: Firestore,
  phoneNumber: string
) {
  const user = _getFsUser(auth);

  logger.log("Phone number verication initiated");
  const provider = new PhoneAuthProvider(auth);
  const recaptchaVerifier = await getRecaptchaVerifier(auth);
  logger.log("reCapthca verifier retreived");
  const verificationId = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
  logger.log("Verification ID retreived");

  // Prompt user to enter the verification code sent to their phone
  logger.log("Prompting verification code input");
  const verificationCode = window.prompt("Inserisci il codice di verifica inviato al tuo numero:");

  if (!verificationCode) {
    const errorMessage="Codice di verifica errato o mancante";
    logger.error(errorMessage);
    return;
  };

  const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
  await linkWithCredential(user, credential);
  await appUserSet(auth,db,{phoneNumber});
}


// --- Helper: Reauthenticate with email/password ---
export async function reauthenticateUser(auth: Auth, email: string, currentPassword: string) {
	const user = userGet(auth);
	const credential = EmailAuthProvider.credential(email, currentPassword);
	await reauthenticateWithCredential(user, credential);
}

// --- Update Email ---
export async function updateUserEmail(auth: Auth, newEmail: string) {
	const user = userGet(auth);
	await updateEmail(user, newEmail);
}

// --- Update Password ---
export async function updateUserPassword(auth: Auth, newPassword: string) {
	const user = userGet(auth);
	await updatePassword(user, newPassword);
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

const firestoreDocs = {create,update,set,get,remove,removeWhere};

export const _fstore: FStore = {
  doc: {
    ...firestoreDocs
  },
  user: {
    doc: {
      set: appUserSet,
      get: appUserGet
    },
    set: {
      profile: userProfileSet,
      phoneNumber: updateUserPhoneNumber
    },
    get: userGet,
    reauthenticate: reauthenticateUser,
    changeEmail: updateUserEmail,
    changePassword: updateUserPassword
  }
}