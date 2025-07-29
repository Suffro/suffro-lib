"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authState = authState;
const auth_1 = require("firebase/auth");
const _typesValidation_1 = require("../../_typesValidation");
/**
 * Store reattivo per l’utente Firebase.
 * - subscribe(cb): si registra per ricevere aggiornamenti (via onAuthStateChanged)
 * - user(): restituisce lo stato corrente dell’utente (User | null)
 * - logged(): restituisce true se l'utente è loggato altrimenti false
 * - get(): Returns app auth instance
 */
function authState(appAuth) {
    let listeners = [];
    let current = null;
    function notify(user) {
        current = user;
        for (const cb of listeners)
            cb(user);
    }
    const isLocalhost = typeof window !== 'undefined' &&
        ['localhost', '127.0.0.1'].includes(window.location.hostname);
    // Avvia il listener Firebase una sola volta
    if (typeof window !== 'undefined') {
        (0, auth_1.onAuthStateChanged)(appAuth, (user) => {
            if (isLocalhost)
                console.log('🔄 Auth state changed:', user);
            notify(user);
        });
    }
    else
        console.error("Error while initializing 'authState()':\n 'window' is not defined.");
    return {
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
            return _typesValidation_1.validate.nonEmptyString(uid);
        },
        /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
        get() {
            return appAuth;
        }
    };
}
//# sourceMappingURL=_authState.js.map