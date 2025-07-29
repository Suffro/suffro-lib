import { Auth, type User } from 'firebase/auth';
/**
 * Store reattivo per l’utente Firebase.
 * - subscribe(cb): si registra per ricevere aggiornamenti (via onAuthStateChanged)
 * - user(): restituisce lo stato corrente dell’utente (User | null)
 * - logged(): restituisce true se l'utente è loggato altrimenti false
 * - get(): Returns app auth instance
 */
export declare function authState(appAuth: ReturnType<typeof import('firebase/auth').getAuth>): {
    /**
     * callback: (user) => void
     * restituisce un unsubscribe
     */
    subscribe(callback: (user: User | null) => void): () => void;
    /** sincrono: leggi l’ultimo valore noto */
    user(): User | null;
    /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
    logged(): boolean;
    /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
    get(): Auth;
};
