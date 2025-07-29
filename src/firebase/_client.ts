import type { FirebaseClient, FirebaseServiceIstances } from "./_types";
import { initStorageMethods } from "./storage";
import { initAuthMethods } from "./auth";
import {
  initFirestoreCurrentUserDocMethods,
  initFirestoreDocsMethods,
} from "./firestore";
import { FirebaseApp, getApp, getApps } from "firebase/app";

let client: FirebaseClient | null | undefined;

export const initializeFirebaseClient = (
  services?: FirebaseServiceIstances
): FirebaseClient => {

  if(client) {
    console.warn("Firebase client already initialized, returning active instance");
    return client;
  }

  const apps: FirebaseApp[] = getApps() || [];

  if (apps?.length && apps?.length === 0) throw "Couldn't find any Firebase initialization";

  let _client: FirebaseClient = {
    instances: {
      app: getApp(),
      ...services,
    },
  };

  if (services?.storage) _client.storage = initStorageMethods(services.storage); // non dipende da auth (credo)

  const auth = services?.auth;
  if (auth) _client["currentUser"] = initAuthMethods(auth);
  else return _client;

  if (services?.firestore) _client["currentUser"]["doc"] = initFirestoreCurrentUserDocMethods(auth, services.firestore);
  if (services?.firestore) _client["firestore"] = initFirestoreDocsMethods(auth, services.firestore);

  client=_client;

  return _client;
};
