import { Auth, onAuthStateChanged, type User } from 'firebase/auth';
import { validate } from '../../_typesValidation';
import { AuthState } from './_types';

let observer: AuthState | null | undefined = null;

/**
 * Store reattivo per l’utente Firebase.
 * - subscribe(cb): si registra per ricevere aggiornamenti (via onAuthStateChanged)
 * - user(): restituisce lo stato corrente dell’utente (User | null)
 * - logged(): restituisce true se l'utente è loggato altrimenti false
 * - get(): Returns app auth instance
 */
export function authStateObsverver(appAuth: ReturnType<typeof import('firebase/auth').getAuth>): AuthState {
  if(observer) {
    console.warn("authStateObsverver() already initialized, returning active instance");
    return observer;
  };

  let listeners: Array<(user: User | null) => void> = [];
  let current: User | null = null;

  function notify(user: User | null) {
    current = user;
    for (const cb of listeners) cb(user);
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
    subscribe(callback: (user: User | null) => void) {
      listeners.push(callback);
      callback(current);
      return () => {
        listeners = listeners.filter((cb) => cb !== callback);
      };
    },

    /** sincrono: leggi l’ultimo valore noto */
    user(): User | null {
      return current;
    },

    /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
    logged(): boolean {
      const uid = current?.uid;
      return validate.nonEmptyString(uid);
	  },

    /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
    get(): Auth {
		  return appAuth;
	  }
  };

  observer = _observer;
  return _observer;
}
