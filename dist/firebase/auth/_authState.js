import { onAuthStateChanged } from 'firebase/auth';
import { validate } from '../../_typesValidation';
let observer = null;
/**
 * Store reattivo per l’utente Firebase.
 * - subscribe(cb): si registra per ricevere aggiornamenti (via onAuthStateChanged)
 * - user(): restituisce lo stato corrente dell’utente (User | null)
 * - logged(): restituisce true se l'utente è loggato altrimenti false
 * - get(): Returns app auth instance
 */
export function authStateObsverver(appAuth) {
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
    // Avvia il listener Firebase una sola volta
    onAuthStateChanged(appAuth, (user) => {
        notify(user);
    });
    const _observer = {
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
            return validate.nonEmptyString(uid);
        },
        /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
        get() {
            return appAuth;
        }
    };
    observer = _observer;
    return _observer;
}
