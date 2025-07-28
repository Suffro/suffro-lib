import type { FirebaseClient, FirebaseServiceIstances } from "./_types";
import type { Auth } from "firebase/auth";
import { initStorageMethods } from "./storage";
import { initAuthMethods } from "./auth";
import { FirebaseAuthMethods } from "./auth/_types";
import { logger } from "../_logger";
import {
  initFirestoreCurrentUserDocMethods,
  initFirestoreDocsMethods,
} from "./firestore";
import { FirebaseApp, getApp, getApps } from "firebase/app";

export const initializeFirebaseClient = (
  services?: FirebaseServiceIstances
): FirebaseClient => {
  logger.logCaller();

  const apps: FirebaseApp[] = getApps() || [];

  if (apps?.length && apps?.length === 0) throw "Couldn't find any Firebase initialization.";

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

  return _client;
};
