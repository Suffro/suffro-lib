import { getApp, getApps, initializeApp, } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, } from "firebase/firestore";
import { validate } from "../_typesValidation";
import { initializeFirebaseClient } from "./_client";
import { isDev } from "../_utils";
let _context;
let _functions;
const initFunctions = (app, region) => {
    try {
        if (!_functions) {
            const fns = getFunctions(app, region);
            _functions = fns;
        }
    }
    catch (error) {
        console.error(error);
        _functions = null;
    }
    finally {
        return;
    }
};
const callFirebaseCallableFunction = async (app, functionName, data, region, options) => {
    if (!_functions)
        initFunctions(app, region);
    if (!_functions)
        return null;
    const callable = httpsCallable(_functions, functionName, options);
    const res = await callable(data);
    return res;
};
export const initializeFirebaseContext = (configuration, logs) => {
    if (!configuration)
        throw new Error("Missing Firebase configuration");
    if (_context) {
        console.warn("Firebase app already initialized, returning active instance");
        return _context;
    }
    const apps = getApps();
    let alreadyInitialized = false;
    if (apps &&
        validate.array(apps) &&
        validate.nonEmptyArray(apps) &&
        apps.length > 0)
        alreadyInitialized = true;
    if (alreadyInitialized)
        throw ("Firebase app already initialized");
    const dev = isDev();
    if (logs && dev)
        console.log("Initializing Firebase instances...");
    const app = alreadyInitialized
        ? getApp()
        : initializeApp(configuration);
    if (logs && dev)
        console.log("Firebase app initialized");
    const auth = getAuth(app);
    if (logs && dev)
        console.log("Firebase auth initialized");
    const storage = configuration.storageBucket
        ? getStorage(app)
        : undefined;
    if (logs && configuration.storageBucket)
        console.log("Firebase storage initialized");
    const firestore = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
        }),
    });
    if (logs && dev)
        console.log("Firebase firestore initialized");
    if (logs && dev)
        console.log("Firebase instances initialized successfully");
    if (logs && dev)
        console.log("Initializing Firebase client...");
    const client = initializeFirebaseClient({
        auth,
        firestore,
        storage,
    });
    if (logs && dev)
        console.log("Firebase client initialization completed.");
    if (logs && dev)
        console.log("Initializing Firebase functions...");
    if (!_functions)
        initFunctions(app, configuration?.regionOrCustomDomain);
    if (_functions && logs && dev)
        console.log("Firebase functions initialization completed.");
    if (!_functions && logs && dev)
        console.warn("Couldn't initialize Firebase functions.");
    const callableFunction = async (name, data, regionOrCustomDomain, options) => {
        const res = await callFirebaseCallableFunction(app, name, data, regionOrCustomDomain, options);
        return res;
    };
    const context = {
        app,
        auth,
        firestore,
        storage,
        client,
        callableFunction
    };
    if (logs && dev)
        console.log("Created Firebase context");
    _context = context;
    return context;
};
