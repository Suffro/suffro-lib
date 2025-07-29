"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebaseContext = void 0;
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const _typesValidation_1 = require("../_typesValidation");
const _client_1 = require("./_client");
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
const initializeFirebaseContext = (configuration, logs) => {
    if (!configuration)
        throw new Error("Missing Firebase configuration");
    if (logs)
        console.log("Initializing Firebase instances...");
    const apps = (0, app_1.getApps)();
    let alreadyInitialized = false;
    if (apps &&
        _typesValidation_1.validate.array(apps) &&
        _typesValidation_1.validate.nonEmptyArray(apps) &&
        apps.length > 0)
        alreadyInitialized = true;
    if (alreadyInitialized)
        console.error("Firebase app already initialized");
    // Initialize Firebase
    const app = alreadyInitialized
        ? (0, app_1.getApp)()
        : (0, app_1.initializeApp)(configuration);
    if (logs)
        console.log("Firebase app initialized");
    const auth = (0, auth_1.getAuth)(app);
    if (logs)
        console.log("Firebase auth initialized");
    const storage = configuration.storageBucket
        ? (0, storage_1.getStorage)(app)
        : undefined;
    if (logs && configuration.storageBucket)
        console.log("Firebase storage initialized");
    const firestore = (0, firestore_1.initializeFirestore)(app, {
        localCache: (0, firestore_1.persistentLocalCache)({
            tabManager: (0, firestore_1.persistentMultipleTabManager)(),
        }),
    });
    if (logs)
        console.log("Firebase firestore initialized");
    if (logs)
        console.log("Firebase instances initialized successfully");
    if (logs)
        console.log("Initializing Firebase client...");
    const client = (0, _client_1.initializeFirebaseClient)({
        auth,
        firestore,
        storage,
    });
    if (logs)
        console.log("Firebase client initialization completed.");
    const context = {
        app,
        auth,
        firestore,
        storage,
        client,
    };
    if (logs)
        console.log("Created Firebase context");
    return context;
};
exports.initializeFirebaseContext = initializeFirebaseContext;
//# sourceMappingURL=_init.js.map