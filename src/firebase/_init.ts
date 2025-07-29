import {
  FirebaseApp,
  FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth } from "firebase/auth";
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { validate } from "../_typesValidation";
import { initializeFirebaseClient } from "./_client";
import { FirebaseInitializationContext } from "./_types";
import { isDev } from "../_utils";

let _context: FirebaseInitializationContext | null | undefined;

/**
 * Initializes and returns a fully configured Firebase instance.
 *
 * This utility function ensures that Firebase is initialized only once,
 * using the provided configuration. It returns the core Firebase services:
 * - Firebase App
 * - Authentication
 * - Firestore (with persistent multi-tab cache)
 * - (Optional) Firebase Storage if a storageBucket is defined
 *
 * The function also includes optional console logs to help with debugging.
 *
 * @param configuration - The Firebase configuration object (FirebaseOptions).
 * @param logs - If true, logs each initialization step to the console (default: false).
 * @returns An object containing `app`, `auth`, `firestore`, and (optionally) `storage`.
 *
 * @throws If configuration is missing or Firebase was already initialized.
 *
 * @example
 * const firebase = initializeFirebaseContext({
 *   apiKey: '...',
 *   authDomain: '...',
 *   projectId: '...',
 *   storageBucket: '...'
 * }, true);
 *
 * const auth = firebase.auth;
 * const db = firebase.firestore;
 */
export const initializeFirebaseContext = (
  configuration: FirebaseOptions,
  logs?: boolean
): FirebaseInitializationContext => {
  if (!configuration) throw new Error("Missing Firebase configuration");

  if(_context){
    console.warn("Firebase app already initialized, returning active instance");
    return _context;
  }

  const apps: FirebaseApp[] = getApps();

  let alreadyInitialized: boolean = false;

  if (
    apps &&
    validate.array(apps) &&
    validate.nonEmptyArray(apps) &&
    apps.length > 0
  )
    alreadyInitialized = true;
  if (alreadyInitialized) throw("Firebase app already initialized");

  const dev = isDev();

  if (logs && dev) console.log("Initializing Firebase instances...");

  // Initialize Firebase
  const app: FirebaseApp = alreadyInitialized
    ? getApp()
    : initializeApp(configuration);
  if(logs && dev) console.log("Firebase app initialized");

  const auth: Auth = getAuth(app);
  if(logs && dev) console.log("Firebase auth initialized");

  const storage: FirebaseStorage | undefined = configuration.storageBucket
    ? getStorage(app)
    : undefined;
  if (logs && configuration.storageBucket)
    console.log("Firebase storage initialized");

  const firestore: Firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  if(logs && dev) console.log("Firebase firestore initialized");

  if(logs && dev) console.log("Firebase instances initialized successfully");

  if(logs && dev) console.log("Initializing Firebase client...");

  const client = initializeFirebaseClient({
    auth,
    firestore,
    storage,
  });

  if(logs && dev) console.log("Firebase client initialization completed.");

  const context: FirebaseInitializationContext = {
    app,
    auth,
    firestore,
    storage,
    client,
  };
  if(logs && dev) console.log("Created Firebase context");

  return context;
};
