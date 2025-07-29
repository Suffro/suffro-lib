import { initStorageMethods } from "./storage";
import { initAuthMethods } from "./auth";
import { logger } from "../_logger";
import { initFirestoreCurrentUserDocMethods, initFirestoreDocsMethods, } from "./firestore";
import { getApp, getApps } from "firebase/app";
export const initializeFirebaseClient = (services) => {
    logger.logCaller();
    const apps = getApps() || [];
    if (apps?.length && apps?.length === 0)
        throw "Couldn't find any Firebase initialization.";
    let _client = {
        instances: {
            app: getApp(),
            ...services,
        },
    };
    if (services?.storage)
        _client.storage = initStorageMethods(services.storage); // non dipende da auth (credo)
    const auth = services?.auth;
    if (auth)
        _client["currentUser"] = initAuthMethods(auth);
    else
        return _client;
    if (services?.firestore)
        _client["currentUser"]["doc"] = initFirestoreCurrentUserDocMethods(auth, services.firestore);
    if (services?.firestore)
        _client["firestore"] = initFirestoreDocsMethods(auth, services.firestore);
    return _client;
};
//# sourceMappingURL=_client.js.map