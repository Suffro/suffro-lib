import { onAuthStateChanged, type User } from 'firebase/auth';
import { validate } from '../../_typesValidation';

/**
 * Store reattivo per l’utente Firebase.
 * - subscribe(cb): si registra per ricevere aggiornamenti (via onAuthStateChanged)
 * - user(): restituisce lo stato corrente dell’utente (User | null)
 * - logged(): restituisce true se l'utente è loggato altrimenti false
 */
export function authState(appAuth: ReturnType<typeof import('firebase/auth').getAuth>) {
  let listeners: Array<(user: User | null) => void> = [];
  let current: User | null = null;

  function notify(user: User | null) {
    current = user;
    for (const cb of listeners) cb(user);
  }

  const isLocalhost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);

  // Avvia il listener Firebase una sola volta
  if (typeof window !== 'undefined') {
    onAuthStateChanged(appAuth, (user) => {
      if(isLocalhost) console.log('🔄 Auth state changed:', user);
      notify(user);
    });
  } else console.error("Error while initializing 'authState()':\n 'window' is not defined.");

  return {
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
	  }
  };
}
