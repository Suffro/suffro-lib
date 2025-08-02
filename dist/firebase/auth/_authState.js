import { onAuthStateChanged } from 'firebase/auth';
import { validate } from '../../_typesValidation';
let observer = null;
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
    onAuthStateChanged(appAuth, (user) => {
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
            return validate.nonEmptyString(uid);
        },
        get() {
            return appAuth;
        }
    };
    observer = _observer;
    return _observer;
}
