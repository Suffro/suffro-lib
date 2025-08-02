import { ExtendedFirebaseOptions, FirebaseInitializationContext } from "./_types";
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
export declare const initializeFirebaseContext: (configuration: ExtendedFirebaseOptions, logs?: boolean) => FirebaseInitializationContext;
