import { AuthState } from './_types';
/**
 * Store reattivo per l’utente Firebase.
 * - subscribe(cb): si registra per ricevere aggiornamenti (via onAuthStateChanged)
 * - user(): restituisce lo stato corrente dell’utente (User | null)
 * - logged(): restituisce true se l'utente è loggato altrimenti false
 * - get(): Returns app auth instance
 */
export declare function authStateObsverver(appAuth: ReturnType<typeof import('firebase/auth').getAuth>): AuthState;
