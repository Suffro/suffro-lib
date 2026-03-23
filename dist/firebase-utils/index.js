import "../chunk-TV57PIZV.js";
import {
  isDev,
  logger,
  redirectOrReload,
  validate,
  wait
} from "../chunk-FJ55SK4B.js";
import {
  cryptoTools
} from "../chunk-3KHKPOKL.js";

// firebase-utils/_reCaptchaVerifier.ts
var recaptchaVerifier = null;
async function getRecaptchaVerifier(auth) {
  if (typeof window === "undefined") throw new Error("reCAPTCHA can only be used in the browser.");
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
  const { RecaptchaVerifier } = await import("firebase/auth");
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible"
    });
  }
  if (!recaptchaVerifier) throw new Error("Failed to create reCAPTCHA verifier");
  return recaptchaVerifier;
}

// firebase-utils/storage/_methods.ts
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getBlob,
  deleteObject
} from "firebase/storage";
var getFilePath = (fileName, folderSegments) => {
  const cleanedFileName = fileName.trim().replaceAll(" ", "_").replaceAll("/", "");
  const cleanedSegments = folderSegments.filter((str) => str.trim() !== "");
  const segmentsString = cleanedSegments.join("/").trim();
  const folderPath = segmentsString.trim().replaceAll("//", "/").replaceAll(" ", "_");
  const rawFullPath = `${folderPath}/${cleanedFileName}`;
  const fullPath = rawFullPath.trim().replaceAll("//", "/").replaceAll(" ", "_");
  if (!(typeof fullPath === "string" && fullPath.trim().length > 0))
    throw "The file path is empty or invalid";
  return {
    folderPath,
    fullPath,
    fileName: cleanedFileName
  };
};
var initStorageMethods = (storage) => ({
  /**
   * Carica un file su Firebase Storage in un path dinamico.
   * @param file - Il file da caricare
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   * @returns URL pubblico al file caricato
   */
  uploadFile: async function _uploadFile(file, fileName, folderSegments) {
    logger.logCaller();
    if (folderSegments.length === 0) {
      throw new Error("Storage path is required");
    }
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  },
  /**
   * Elimina un file da Firebase Storage.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   */
  deleteFile: async function _deleteFile(fileName, folderSegments) {
    logger.logCaller();
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);
    await deleteObject(fileRef);
  },
  /**
   * Elenca tutti i file in una cartella.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   */
  listFiles: async function _listFiles(folderSegments) {
    logger.logCaller();
    const folderPath = getFilePath("", folderSegments)?.folderPath;
    const folderRef = ref(storage, folderPath);
    const res = await listAll(folderRef);
    const urls = await Promise.all(
      res.items.map((itemRef) => getDownloadURL(itemRef))
    );
    return urls;
  },
  /**
   * Scarica un file come Blob.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   * @returns Un Blob del file
   */
  downloadFile: async function _downloadFileAsBlob(fileName, folderSegments) {
    logger.logCaller();
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);
    return await getBlob(fileRef);
  },
  /**
   * Ottiene l'URL pubblico di un file.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   */
  getFileUrl: async function _getPublicDownloadURL(fileName, folderSegments) {
    logger.logCaller();
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);
    return await getDownloadURL(fileRef);
  }
});

// firebase-utils/auth/_methods.ts
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateEmail,
  updatePassword
} from "firebase/auth";
var initAuthMethods = (auth) => ({
  //////////////////// SIGNOUT ////////////////////
  signout: async function firebaseSignout(options) {
    try {
      logger.logCaller();
      await signOut(auth);
      try {
        await wait(400);
        redirectOrReload(options);
      } catch (error) {
        logger.error(error);
      }
    } catch (err) {
      logger.devError("Logout failed:", err);
    }
  },
  //////////////////// SIGNUP ////////////////////
  signup: async function firebaseSignup(email, password, passwordConfirmation, redirectPath) {
    try {
      logger.logCaller();
      if (password != passwordConfirmation)
        throw new Error("Passwords do not match");
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      logger.log("User signed up:", userCredential.user);
    } catch (err) {
      logger.devError("Signup error:", err);
    }
  },
  //////////////////// SIGNIN ////////////////////
  signin: async function firebaseSignin(email, password, remember, redirectPath) {
    try {
      logger.logCaller();
      const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      logger.log("\u2705 persistence set");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      logger.log("\u2705 Signed in:", userCredential.user);
    } catch (err) {
      logger.devError(err);
    }
  },
  //////////////////// FORGOT PASSWORD ////////////////////
  forgotPassword: async function forgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      logger.devError(error);
    }
  },
  //////////////////// GOOGLE AUTH ////////////////////
  googleAuth: async function googleAuth(withRedirect) {
    try {
      logger.logCaller();
      const provider = new GoogleAuthProvider();
      await setPersistence(auth, browserLocalPersistence);
      logger.log("Auth persistence set");
      if (withRedirect) {
        console.log(`Starting Google auth [redirect]`);
        await signInWithRedirect(auth, provider);
      } else {
        console.log(`Starting Google auth [popup]`);
        const result = await signInWithPopup(auth, provider);
        const user = result?.user;
      }
    } catch (error) {
      logger.devError("Google auth error:\n", error?.message);
    }
  },
  //////////////////// GITHUB AUTH ////////////////////
  githubAuth: async function gitHubAuth(withRedirect) {
    try {
      logger.logCaller();
      const provider = new GithubAuthProvider();
      await setPersistence(auth, browserLocalPersistence);
      logger.log("Auth persistence set");
      if (withRedirect) {
        console.log(`Starting GitHub auth [redirect]`);
        await signInWithRedirect(auth, provider);
      } else {
        console.log(`Starting GitHub auth [popup]`);
        const result = await signInWithPopup(auth, provider);
        const user = result?.user;
      }
    } catch (error) {
      logger.devError("GitHub auth error:\n", error?.message);
    }
  },
  isLoggedIn: () => {
    logger.logCaller();
    if (!auth) return false;
    const currentUser = auth?.currentUser;
    logger.log(currentUser);
    if (!currentUser) return false;
    const isAnonymus = currentUser?.isAnonymous;
    logger.log(isAnonymus);
    if (isAnonymus) return false;
    const uid = currentUser?.uid;
    logger.log(uid);
    if (!validate.nonEmptyString(uid)) return false;
    return true;
  },
  // --- Helper: Reauthenticate with email/password ---
  reauthenticate: async function reauthenticateUser(email, currentPassword) {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  },
  // --- Update Email ---
  updateEmail: async function updateUserEmail(newEmail) {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    await updateEmail(user, newEmail);
  },
  // --- Update Password ---
  updatePassword: async function updateUserPassword(newPassword) {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    await updatePassword(user, newPassword);
  },
  // --- Update Password ---
  get: function get2() {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    return user;
  }
});

// firebase-utils/auth/_authState.ts
import { onAuthStateChanged } from "firebase/auth";
var observer = null;
function authStateObsverver(appAuth) {
  if (observer) {
    console.warn("authStateObsverver() already initialized, returning active instance");
    return observer;
  }
  ;
  let listeners = [];
  let current = null;
  function notify(user) {
    current = user;
    for (const cb of listeners) cb(user);
  }
  onAuthStateChanged(appAuth, (user) => {
    notify(user);
  });
  const _observer = {
    /** 
     * callback: (user) => void  
     * restituisce un unsubscribe 
     */
    subscribe(callback) {
      listeners.push(callback);
      callback(current);
      return () => {
        listeners = listeners.filter((cb) => cb !== callback);
      };
    },
    /** sincrono: leggi l’ultimo valore noto */
    user() {
      return current;
    },
    /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
    logged() {
      const uid = current?.uid;
      return validate.nonEmptyString(uid);
    },
    /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
    get() {
      return appAuth;
    }
  };
  observer = _observer;
  return _observer;
}

// firebase-utils/firestore/_methods.ts
import {
  doc,
  setDoc,
  updateDoc,
  Timestamp,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import {
  PhoneAuthProvider,
  linkWithCredential,
  updateProfile
} from "firebase/auth";
var _userCollectionRestriction = (collectionName) => {
  if (collectionName === "users")
    throw new Error("Do NOT use this function for the user doc");
};
var _getFsUser = (auth) => {
  if (!auth?.currentUser) throw new Error("User not found");
  return auth.currentUser;
};
async function _getDoc(db, collectionName, id) {
  logger.logCaller();
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const ref2 = doc(db, collectionName, id);
  const snap = await getDoc(ref2);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
async function create(auth, db, collectionName, data) {
  logger.logCaller();
  _userCollectionRestriction(collectionName);
  const date = /* @__PURE__ */ new Date();
  const createdAt = Timestamp.fromDate(date);
  const preRef = doc(collection(db, collectionName));
  const raw = `${preRef.id}_${createdAt.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await setDoc(preRef, {
    id: preRef.id,
    hash,
    locale: navigator?.language || (await appUserGet(auth, db))?.locale,
    createdAt,
    lastModified: createdAt,
    ...data
  });
  return preRef.id;
}
async function update(db, collectionName, id, data) {
  logger.logCaller();
  _userCollectionRestriction(collectionName);
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const date = /* @__PURE__ */ new Date();
  const lastModified = Timestamp.fromDate(date);
  const preRef = doc(collection(db, collectionName));
  const raw = `${id}_${lastModified.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    hash,
    lastModified
  });
  return id;
}
async function set(db, collectionName, id, data) {
  _userCollectionRestriction(collectionName);
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const date = /* @__PURE__ */ new Date();
  const lastModified = Timestamp.fromDate(date);
  const preRef = doc(collection(db, collectionName));
  const raw = `${id}_${lastModified.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await setDoc(doc(db, collectionName, id), {
    ...data,
    id,
    hash,
    lastModified
  }, { merge: true });
  return id;
}
async function get(db, collectionName, id) {
  logger.logCaller();
  _userCollectionRestriction(collectionName);
  return await _getDoc(db, collectionName, id);
}
async function listDocs(db, collectionName, conditions) {
  logger.logCaller();
  let q;
  if (conditions && conditions?.length > 0) {
    q = query(
      collection(db, collectionName),
      ...conditions.map(([field, op, value]) => where(field, op, value))
    );
  } else {
    q = collection(db, collectionName);
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}
async function remove(db, collection2, id) {
  logger.logCaller();
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const docRef = doc(db, collection2, id);
  await deleteDoc(docRef);
  return id;
}
async function removeWhere(db, collectionName, conditions) {
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
async function createInSubcollection(db, parentCollection, parentId, subcollection, data, isUser) {
  logger.logCaller();
  if (!validate.string(parentId)) throw new Error("Missing parent document ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const subRef = collection(db, parentCollection, parentId, subcollection);
  const preRef = doc(subRef);
  const createdAt = Timestamp.fromDate(/* @__PURE__ */ new Date());
  const raw = `${preRef.id}_${createdAt.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await setDoc(preRef, {
    ...data,
    id: preRef.id,
    hash,
    createdAt
  });
  return preRef.id;
}
async function setInSubcollection(db, parentCollection, parentId, subcollection, docId, data, isUser) {
  logger.logCaller();
  if (!validate.string(parentId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const ref2 = doc(db, parentCollection, parentId, subcollection, docId);
  const lastModified = Timestamp.fromDate(/* @__PURE__ */ new Date());
  const raw = `${docId}_${lastModified.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await setDoc(ref2, {
    ...data,
    id: docId,
    hash,
    lastModified
  }, { merge: true });
  return docId;
}
async function getFromSubcollection(db, parentCollection, parentId, subcollection, docId, isUser) {
  logger.logCaller();
  if (!validate.string(parentId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const ref2 = doc(db, parentCollection, parentId, subcollection, docId);
  const snap = await getDoc(ref2);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
async function listFromSubcollection(db, parentCollection, parentId, subcollection, isUser) {
  logger.logCaller();
  if (!validate.string(parentId))
    throw new Error("Missing parent document ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const colRef = collection(db, parentCollection, parentId, subcollection);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}
async function removeFromSubcollection(db, parentCollection, parentId, subcollection, docId, isUser) {
  logger.logCaller();
  if (!validate.string(parentId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const ref2 = doc(db, parentCollection, parentId, subcollection, docId);
  await deleteDoc(ref2);
  return docId;
}
async function appUserSet(auth, db, data, opts = { merge: true }) {
  logger.logCaller();
  const user = _getFsUser(auth);
  const { merge, id } = opts;
  const userId = id ?? user?.uid;
  if (!validate.string(userId))
    throw new Error("Could not find User or its uid.");
  await setDoc(
    doc(db, "users", userId),
    {
      ...data,
      displayName: data?.displayName ?? user.displayName
    },
    { merge }
  );
}
async function appUserGet(auth, db) {
  logger.logCaller();
  const userId = auth.currentUser?.uid;
  if (!validate.string(userId))
    throw new Error("Could not find User or its uid.");
  const userData = await _getDoc(db, "users", userId);
  if (!userData) logger.warn("\u26A0\uFE0F No user document found.");
  return userData;
}
async function appUserCreateInSubcollection(db, userId, subcollection, data) {
  logger.logCaller();
  if (!validate.string(userId)) throw new Error("Missing user document ID.");
  const id = await createInSubcollection(db, "users", userId, subcollection, data, true);
  return id;
}
async function appUserSetInSubcollection(db, userId, subcollection, docId, data) {
  logger.logCaller();
  if (!validate.string(userId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  await setInSubcollection(db, "users", userId, subcollection, docId, data, true);
  return docId;
}
async function appUserGetFromSubcollection(db, userId, subcollection, docId) {
  logger.logCaller();
  if (!validate.string(userId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  const res = await getFromSubcollection(db, "users", userId, subcollection, docId, true);
  return res;
}
async function appUserListFromSubcollection(db, userId, subcollection) {
  logger.logCaller();
  if (!validate.string(userId))
    throw new Error("Missing parent document ID.");
  const res = await listFromSubcollection(db, "users", userId, subcollection, true);
  return res;
}
async function appUserRemoveFromSubcollection(db, userId, subcollection, docId) {
  logger.logCaller();
  if (!validate.string(userId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  await removeFromSubcollection(db, "users", userId, subcollection, docId, true);
  return docId;
}
var initFirestoreDocsMethods = (auth, db, usersCollectionName = "users") => ({
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
  list: async function _list(collectionName, conditions) {
    if (conditions && conditions?.length > 0) return await listDocs(db, collectionName, conditions);
    else return await listDocs(db, collectionName);
  },
  remove: async function _remove(collectionName, id) {
    return await remove(db, collectionName, id);
  },
  removeWhere: async function _removeWhere(collectionName, conditions) {
    return await removeWhere(db, collectionName, conditions);
  },
  subcollections: {
    create: async function _create(parentCollection, parentId, subcollection, data) {
      const res = await createInSubcollection(db, parentCollection, parentId, subcollection, data);
      return res;
    },
    set: async function _set(parentCollection, parentId, subcollection, docId, data) {
      const res = await setInSubcollection(db, parentCollection, parentId, subcollection, docId, data);
      return res;
    },
    get: async function _get(parentCollection, parentId, subcollection, docId) {
      const res = await getFromSubcollection(db, parentCollection, parentId, subcollection, docId);
      return res;
    },
    list: async function _list(parentCollection, parentId, subcollection) {
      const res = await listFromSubcollection(db, parentCollection, parentId, subcollection);
      return res;
    },
    remove: async function _remove(parentCollection, parentId, subcollection, docId) {
      const res = await removeFromSubcollection(db, parentCollection, parentId, subcollection, docId);
      return res;
    }
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
    subcollections: {
      create: async function _create(userId, subcollection, data) {
        const res = await appUserCreateInSubcollection(db, userId, subcollection, data);
        return res;
      },
      set: async function _set(userId, subcollection, docId, data) {
        const res = await appUserSetInSubcollection(db, userId, subcollection, docId, data);
        return res;
      },
      get: async function _get(userId, subcollection, docId) {
        const res = await appUserGetFromSubcollection(db, userId, subcollection, docId);
        return res;
      },
      list: async function _list(userId, subcollection) {
        const res = await appUserListFromSubcollection(db, userId, subcollection);
        return res;
      },
      remove: async function _remove(userId, subcollection, docId) {
        const res = await appUserRemoveFromSubcollection(db, userId, subcollection, docId);
        return res;
      }
    }
  }
});
var initFirestoreCurrentUserDocMethods = (auth, db) => ({
  set: async function _set(data, opts) {
    return await appUserSet(auth, db, data, opts);
  },
  get: async function _get() {
    return await appUserGet(auth, db);
  }
});

// firebase-utils/firestore/_firestoreTypesValidation.ts
import { Timestamp as Timestamp2 } from "firebase-admin/firestore";
import {
  Timestamp as LocalTimestamp,
  GeoPoint
} from "firebase/firestore";

// firebase-utils/_client.ts
import { getApp, getApps } from "firebase/app";
var client;
var initializeFirebaseClient = (services) => {
  if (client) {
    console.warn("Firebase client already initialized, returning active instance");
    return client;
  }
  const apps = getApps() || [];
  if (apps?.length && apps?.length === 0) throw "Couldn't find any Firebase initialization";
  let _client = {
    instances: {
      app: getApp(),
      ...services
    }
  };
  if (services?.storage) _client.storage = initStorageMethods(services.storage);
  const auth = services?.auth;
  if (auth) _client["currentUser"] = initAuthMethods(auth);
  else return _client;
  if (services?.firestore) _client["currentUser"]["doc"] = initFirestoreCurrentUserDocMethods(auth, services.firestore);
  if (services?.firestore) _client["firestore"] = initFirestoreDocsMethods(auth, services.firestore);
  client = _client;
  return _client;
};

// firebase-utils/_init.ts
import {
  getApp as getApp2,
  getApps as getApps2,
  initializeApp
} from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";
var _context;
var _functions;
var initFunctions = (app, region) => {
  try {
    if (!_functions) {
      const fns = getFunctions(app, region);
      _functions = fns;
    }
  } catch (error) {
    console.error(error);
    _functions = null;
  } finally {
    return;
  }
};
var initializeFirebaseContext = (configuration, logs) => {
  if (!configuration) throw new Error("Missing Firebase configuration");
  if (_context) {
    console.warn("Firebase app already initialized, returning active instance");
    return _context;
  }
  const apps = getApps2();
  let alreadyInitialized = false;
  if (apps && validate.array(apps) && validate.nonEmptyArray(apps) && apps.length > 0)
    alreadyInitialized = true;
  if (alreadyInitialized) throw "Firebase app already initialized";
  const dev = isDev();
  if (logs && dev) console.log("Initializing Firebase instances...");
  const app = alreadyInitialized ? getApp2() : initializeApp(configuration);
  if (logs && dev) console.log("Firebase app initialized");
  const auth = getAuth(app);
  if (logs && dev) console.log("Firebase auth initialized");
  const storage = configuration.storageBucket ? getStorage(app) : void 0;
  if (logs && configuration.storageBucket)
    console.log("Firebase storage initialized");
  const firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  if (logs && dev) console.log("Firebase firestore initialized");
  if (logs && dev) console.log("Firebase instances initialized successfully");
  if (logs && dev) console.log("Initializing Firebase client...");
  const client2 = initializeFirebaseClient({
    auth,
    firestore,
    storage
  });
  if (logs && dev) console.log("Firebase client initialization completed.");
  if (logs && dev) console.log("Initializing Firebase functions...");
  if (!_functions) initFunctions(app, configuration?.regionOrCustomDomain);
  if (_functions && logs && dev) console.log("Firebase functions initialization completed.");
  if (!_functions && logs && dev) console.warn("Couldn't initialize Firebase functions.");
  const callableFunction = (functionName, options) => {
    if (!_functions) initFunctions(app);
    if (!_functions) return null;
    const callable = httpsCallable(_functions, functionName, options);
    return callable;
  };
  const context = {
    app,
    auth,
    firestore,
    storage,
    client: client2,
    functions: {
      get: () => _functions,
      callable: callableFunction
    }
  };
  if (logs && dev) console.log("Created Firebase context");
  _context = context;
  return context;
};
export {
  authStateObsverver,
  getRecaptchaVerifier,
  initializeFirebaseClient,
  initializeFirebaseContext
};
//# sourceMappingURL=index.js.map