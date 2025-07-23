
import { _storageMethods } from "./storage"
import { _firebaseAuthMethods, isLoggedIn } from "./auth"
import type { FirebaseClient } from "./_types"
import { _fstore } from "./firestore"
import type { Auth } from "firebase/auth"
import { Firestore } from "firebase/firestore"

export const initFirebaseClient = (auth: Auth, db: Firestore): FirebaseClient => {
    const client: FirebaseClient = {
        user: {
            ...(_fstore.user),
            loggedIn: isLoggedIn
        },
        auth: {
            ..._firebaseAuthMethods,
            instance: ()=> auth
        },
        db,
        doc: _fstore.doc,
        storage: _storageMethods,
        // analytics: _analytics
    };
    return client;
}