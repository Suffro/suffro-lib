"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebaseClient = void 0;
const storage_1 = require("./storage");
const auth_1 = require("./auth");
const _logger_1 = require("../_logger");
const firestore_1 = require("./firestore");
const app_1 = require("firebase/app");
let client;
const initializeFirebaseClient = (services) => {
    _logger_1.logger.logCaller();
    if (client) {
        _logger_1.logger.warn("Firebase client already initialized, returning active instance");
        return client;
    }
    const apps = (0, app_1.getApps)() || [];
    if (apps?.length && apps?.length === 0)
        throw "Couldn't find any Firebase initialization";
    let _client = {
        instances: {
            app: (0, app_1.getApp)(),
            ...services,
        },
    };
    if (services?.storage)
        _client.storage = (0, storage_1.initStorageMethods)(services.storage); // non dipende da auth (credo)
    const auth = services?.auth;
    if (auth)
        _client["currentUser"] = (0, auth_1.initAuthMethods)(auth);
    else
        return _client;
    if (services?.firestore)
        _client["currentUser"]["doc"] = (0, firestore_1.initFirestoreCurrentUserDocMethods)(auth, services.firestore);
    if (services?.firestore)
        _client["firestore"] = (0, firestore_1.initFirestoreDocsMethods)(auth, services.firestore);
    client = _client;
    return _client;
};
exports.initializeFirebaseClient = initializeFirebaseClient;
//# sourceMappingURL=_client.js.map