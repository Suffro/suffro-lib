import { FirebaseOptions } from "firebase/app";
import { FirebaseInitializationContext } from "./_types";
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
export declare const initializeFirebaseContext: (configuration: FirebaseOptions, logs?: boolean) => FirebaseInitializationContext;
