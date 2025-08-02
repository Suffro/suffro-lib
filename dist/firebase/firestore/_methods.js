"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFirestoreCurrentUserDocMethods = exports.initFirestoreDocsMethods = void 0;
exports._getDoc = _getDoc;
exports.create = create;
exports.update = update;
exports.set = set;
exports.get = get;
exports.remove = remove;
exports.removeWhere = removeWhere;
exports.appUserSet = appUserSet;
exports.appUserGet = appUserGet;
exports.userGet = userGet;
exports.userProfileSet = userProfileSet;
exports.updateUserPhoneNumber = updateUserPhoneNumber;
const firestore_1 = require("firebase/firestore");
const __1 = require("../");
const __2 = require("../../");
const __3 = require("../../");
const auth_1 = require("firebase/auth");
const _userCollectionRestriction = (collectionName) => {
    if (collectionName === "users")
        throw new Error("Do NOT use this function for the user doc");
};
const _getFsUser = (auth) => {
    if (!auth?.currentUser)
        throw new Error("User not found");
    return auth.currentUser;
};
async function _getDoc(db, collectionName, id) {
    __2.logger.logCaller();
    if (!__3.validate.string(id))
        throw new Error("Missing document ID.");
    const ref = (0, firestore_1.doc)(db, collectionName, id);
    const snap = await (0, firestore_1.getDoc)(ref);
    if (!snap.exists())
        return null;
    return { id: snap.id, ...snap.data() };
}
async function create(auth, db, collectionName, data) {
    __2.logger.logCaller();
    _userCollectionRestriction(collectionName);
    const date = new Date();
    const preRef = (0, firestore_1.doc)((0, firestore_1.collection)(db, collectionName));
    await (0, firestore_1.setDoc)(preRef, {
        id: preRef.id,
        locale: navigator?.language || (await appUserGet(auth, db))?.locale,
        createdAt: firestore_1.Timestamp.fromDate(date),
        ...data,
    });
    return preRef.id;
}
async function update(db, collectionName, id, data) {
    __2.logger.logCaller();
    _userCollectionRestriction(collectionName);
    if (!__3.validate.string(id))
        throw new Error("Missing document ID.");
    const date = new Date();
    await (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, collectionName, id), {
        ...data,
    });
    return id;
}
async function set(db, collectionName, id, data) {
    _userCollectionRestriction(collectionName);
    if (!__3.validate.string(id))
        throw new Error("Missing document ID.");
    const date = new Date();
    await (0, firestore_1.setDoc)((0, firestore_1.doc)(db, collectionName, id), {
        ...data,
        id,
    });
    return id;
}
async function get(db, collectionName, id) {
    __2.logger.logCaller();
    _userCollectionRestriction(collectionName);
    return await _getDoc(db, collectionName, id);
}
async function remove(db, collection, id) {
    __2.logger.logCaller();
    if (!__3.validate.string(id))
        throw new Error("Missing document ID.");
    const docRef = (0, firestore_1.doc)(db, collection, id);
    await (0, firestore_1.deleteDoc)(docRef);
    return id;
}
async function removeWhere(db, collectionName, conditions) {
    __2.logger.logCaller();
    const q = (0, firestore_1.query)((0, firestore_1.collection)(db, collectionName), ...conditions.map(([field, op, value]) => (0, firestore_1.where)(field, op, value)));
    const snapshot = await (0, firestore_1.getDocs)(q);
    const deletions = snapshot.docs.map((docSnap) => (0, firestore_1.deleteDoc)(docSnap.ref));
    await Promise.all(deletions);
    return snapshot.docs.map((docSnap) => docSnap.id);
}
async function appUserSet(auth, db, data, opts = { merge: true }) {
    __2.logger.logCaller();
    const user = _getFsUser(auth);
    const { merge, id } = opts;
    const userId = id ?? user?.uid;
    if (!__3.validate.string(userId))
        throw new Error("Could not find User or its uid.");
    await (0, firestore_1.setDoc)((0, firestore_1.doc)(db, "users", userId), {
        ...data,
        displayName: data?.displayName ?? user.displayName,
    }, { merge });
}
async function appUserGet(auth, db) {
    __2.logger.logCaller();
    const userId = auth.currentUser?.uid;
    if (!__3.validate.string(userId))
        throw new Error("Could not find User or its uid.");
    const userData = await _getDoc(db, "users", userId);
    if (!userData)
        __2.logger.warn("⚠️ No user document found.");
    return userData;
}
function userGet(auth) {
    __2.logger.logCaller();
    const user = _getFsUser(auth);
    return user;
}
async function userProfileSet(auth, data) {
    __2.logger.logCaller();
    const user = _getFsUser(auth);
    await (0, auth_1.updateProfile)(user, data);
}
async function updateUserPhoneNumber(auth, db, phoneNumber) {
    __2.logger.logCaller();
    const user = _getFsUser(auth);
    __2.logger.log("Phone number verication initiated");
    const provider = new auth_1.PhoneAuthProvider(auth);
    const recaptchaVerifier = await (0, __1.getRecaptchaVerifier)(auth);
    __2.logger.log("reCapthca verifier retreived");
    const verificationId = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
    __2.logger.log("Verification ID retreived");
    __2.logger.log("Prompting verification code input");
    const verificationCode = window.prompt("Inserisci il codice di verifica inviato al tuo numero:");
    if (!verificationCode) {
        const errorMessage = "Codice di verifica errato o mancante";
        __2.logger.error(errorMessage);
        return;
    }
    const credential = auth_1.PhoneAuthProvider.credential(verificationId, verificationCode);
    await (0, auth_1.linkWithCredential)(user, credential);
    await appUserSet(auth, db, { phoneNumber });
}
const initFirestoreDocsMethods = (auth, db, usersCollectionName = "users") => ({
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
exports.initFirestoreDocsMethods = initFirestoreDocsMethods;
const initFirestoreCurrentUserDocMethods = (auth, db) => ({
    set: async function _set(data, opts) {
        return await appUserSet(auth, db, data, opts);
    },
    get: async function _get() {
        return await appUserGet(auth, db);
    },
});
exports.initFirestoreCurrentUserDocMethods = initFirestoreCurrentUserDocMethods;
