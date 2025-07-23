import { getApp, getApps, initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
//import { getAnalytics } from 'firebase/analytics';
import {
	getAuth
} from 'firebase/auth';
import {
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager
} from 'firebase/firestore';
import { dev } from '$app/environment';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: dev
    ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEV
	: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const appAuth = getAuth(app); 

//export const _analytics = getAnalytics(app);

export const _storage = getStorage(app);

export const _db = initializeFirestore(app, {
	localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
