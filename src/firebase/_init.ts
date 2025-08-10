import {
  FirebaseApp,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth } from "firebase/auth";
import { Functions, getFunctions, HttpsCallable, httpsCallable, HttpsCallableOptions, HttpsCallableResult } from "firebase/functions";
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { validate } from "../_typesValidation";
import { initializeFirebaseClient } from "./_client";
import { ExtendedFirebaseOptions, FirebaseInitializationContext } from "./_types";
import { isDev } from "../_utils";

let _context: FirebaseInitializationContext | null | undefined;

let _functions: Functions | null | undefined;

const initFunctions = (app: FirebaseApp, region?: string): void => {
    try {
      if(!_functions) {
      const fns = getFunctions(app, region);
      _functions = fns;
    }
  } catch (error) {
      console.error(error);
      _functions=null;
    } finally {
      return;
    }
}

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
export const initializeFirebaseContext = (
  configuration: ExtendedFirebaseOptions,
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

  if(logs && dev) console.log("Initializing Firebase functions...");
  if(!_functions) initFunctions(app, configuration?.regionOrCustomDomain);
  if(_functions && logs && dev) console.log("Firebase functions initialization completed.");
  if(!_functions && logs && dev) console.warn("Couldn't initialize Firebase functions.");

  const callableFunction = (functionName: string, data?: any, region?: string, options?: HttpsCallableOptions): HttpsCallable<unknown, unknown, unknown> | null => {
    if(!_functions) initFunctions(app, region);
    if(!_functions) return null;
    const callable = httpsCallable(_functions, functionName, options);
    return callable;
  }

  const context: FirebaseInitializationContext = {
    app,
    auth,
    firestore,
    storage,
    client,
    functions: {
      get: ()=>_functions,
      callable: callableFunction
    }
  };
  if(logs && dev) console.log("Created Firebase context");

  _context=context;

  return context;
};
