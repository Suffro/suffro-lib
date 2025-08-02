"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authStateObsverver = authStateObsverver;
const auth_1 = require("firebase/auth");
const _typesValidation_1 = require("../../_typesValidation");
let observer = null;
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
        for (const cb of listeners)
            cb(user);
    }
    (0, auth_1.onAuthStateChanged)(appAuth, (user) => {
        notify(user);
    });
    const _observer = {
        subscribe(callback) {
            listeners.push(callback);
            callback(current);
            return () => {
                listeners = listeners.filter((cb) => cb !== callback);
            };
        },
        user() {
            return current;
        },
        logged() {
            const uid = current?.uid;
            return _typesValidation_1.validate.nonEmptyString(uid);
        },
        get() {
            return appAuth;
        }
    };
    observer = _observer;
    return _observer;
}
