
import { _db } from "./_init"
import { _storageMethods } from "./storage"
import { _firebaseAuthMethods, isLoggedIn } from "./auth"
import type { FirebaseClient } from "./_types"
import { _fstore } from "./firestore"
import type { Auth } from "firebase/auth"

export const initFirebaseClient = (auth: Auth): FirebaseClient => {
    const client: FirebaseClient = {
        user: {
            ...(_fstore.user),
            loggedIn: isLoggedIn
        },
        auth: {
            ..._firebaseAuthMethods,
            instance: ()=> auth
        },
        db: _db,
        doc: _fstore.doc,
        storage: _storageMethods,
        // analytics: _analytics
    };
    return client;
}