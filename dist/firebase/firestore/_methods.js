import { doc, setDoc, updateDoc, Timestamp, getDoc, deleteDoc, collection, query, where, getDocs, } from "firebase/firestore";
import { getRecaptchaVerifier, } from "../";
import { logger } from "../../";
import { validate } from "../../";
import { PhoneAuthProvider, linkWithCredential, updateProfile, } from "firebase/auth";
const _userCollectionRestriction = (collectionName) => {
    if (collectionName === "users")
        throw new Error("Do NOT use this function for the user doc");
};
const _getFsUser = (auth) => {
    if (!auth?.currentUser)
        throw new Error("User not found");
    return auth.currentUser;
};
export async function _getDoc(db, collectionName, id) {
    logger.logCaller();
    if (!validate.string(id))
        throw new Error("Missing document ID.");
    const ref = doc(db, collectionName, id);
    const snap = await getDoc(ref);
    if (!snap.exists())
        return null;
    return { id: snap.id, ...snap.data() };
}
export async function create(auth, db, collectionName, data) {
    logger.logCaller();
    _userCollectionRestriction(collectionName);
    const date = new Date();
    const preRef = doc(collection(db, collectionName));
    await setDoc(preRef, {
        id: preRef.id,
        locale: navigator?.language || (await appUserGet(auth, db))?.locale,
        createdAt: Timestamp.fromDate(date),
        ...data,
    });
    return preRef.id;
}
export async function update(db, collectionName, id, data) {
    logger.logCaller();
    _userCollectionRestriction(collectionName);
    if (!validate.string(id))
        throw new Error("Missing document ID.");
    const date = new Date();
    await updateDoc(doc(db, collectionName, id), {
        ...data,
    });
    return id;
}
export async function set(db, collectionName, id, data) {
    _userCollectionRestriction(collectionName);
    if (!validate.string(id))
        throw new Error("Missing document ID.");
    const date = new Date();
    await setDoc(doc(db, collectionName, id), {
        ...data,
        id,
    });
    return id;
}
export async function get(db, collectionName, id) {
    logger.logCaller();
    _userCollectionRestriction(collectionName);
    return await _getDoc(db, collectionName, id);
}
export async function remove(db, collection, id) {
    logger.logCaller();
    if (!validate.string(id))
        throw new Error("Missing document ID.");
    const docRef = doc(db, collection, id);
    await deleteDoc(docRef);
    return id;
}
export async function removeWhere(db, collectionName, conditions) {
    logger.logCaller();
    const q = query(collection(db, collectionName), ...conditions.map(([field, op, value]) => where(field, op, value)));
    const snapshot = await getDocs(q);
    const deletions = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletions);
    return snapshot.docs.map((docSnap) => docSnap.id);
}
export async function appUserSet(auth, db, data, opts = { merge: true }) {
    logger.logCaller();
    const user = _getFsUser(auth);
    const { merge, id } = opts;
    const userId = id ?? user?.uid;
    if (!validate.string(userId))
        throw new Error("Could not find User or its uid.");
    await setDoc(doc(db, "users", userId), {
        ...data,
        displayName: data?.displayName ?? user.displayName,
    }, { merge });
}
export async function appUserGet(auth, db) {
    logger.logCaller();
    const userId = auth.currentUser?.uid;
    if (!validate.string(userId))
        throw new Error("Could not find User or its uid.");
    const userData = await _getDoc(db, "users", userId);
    if (!userData)
        logger.warn("⚠️ No user document found.");
    return userData;
}
export function userGet(auth) {
    logger.logCaller();
    const user = _getFsUser(auth);
    return user;
}
export async function userProfileSet(auth, data) {
    logger.logCaller();
    const user = _getFsUser(auth);
    await updateProfile(user, data);
}
export async function updateUserPhoneNumber(auth, db, phoneNumber) {
    logger.logCaller();
    const user = _getFsUser(auth);
    logger.log("Phone number verication initiated");
    const provider = new PhoneAuthProvider(auth);
    const recaptchaVerifier = await getRecaptchaVerifier(auth);
    logger.log("reCapthca verifier retreived");
    const verificationId = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
    logger.log("Verification ID retreived");
    logger.log("Prompting verification code input");
    const verificationCode = window.prompt("Inserisci il codice di verifica inviato al tuo numero:");
    if (!verificationCode) {
        const errorMessage = "Codice di verifica errato o mancante";
        logger.error(errorMessage);
        return;
    }
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    await linkWithCredential(user, credential);
    await appUserSet(auth, db, { phoneNumber });
}
export const initFirestoreDocsMethods = (auth, db, usersCollectionName = "users") => ({
    create: async function _create(collectionName, data) {
        return await create(auth, db, collectionName, data);
    },
    update: async function _update(collectionName, id, data) {
        return await update(db, collectionName, id, data);
    },
    set: async function _set(collectionName, id, data) {
        return await set(db, collectionName, id, data);
    },
    get: async function _get(collectionName, id) {
        return await get(db, collectionName, id);
    },
    remove: async function _remove(collectionName, id) {
        return await remove(db, collectionName, id);
    },
    removeWhere: async function _removeWhere(collectionName, conditions) {
        return await removeWhere(db, collectionName, conditions);
    },
    users: {
        create: async function _create(data) {
            return await create(auth, db, usersCollectionName, data);
        },
        update: async function _update(id, data) {
            return await update(db, usersCollectionName, id, data);
        },
        set: async function _set(id, data) {
            return await set(db, usersCollectionName, id, data);
        },
        get: async function _get(id) {
            return await get(db, usersCollectionName, id);
        },
        remove: async function _remove(id) {
            return await remove(db, usersCollectionName, id);
        },
        removeWhere: async function _removeWhere(conditions) {
            return await removeWhere(db, usersCollectionName, conditions);
        },
    },
});
export const initFirestoreCurrentUserDocMethods = (auth, db) => ({
    set: async function _set(data, opts) {
        return await appUserSet(auth, db, data, opts);
    },
    get: async function _get() {
        return await appUserGet(auth, db);
    },
});
