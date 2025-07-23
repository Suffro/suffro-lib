import type { User } from "firebase/auth";
import { writable } from "svelte/store";
import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';
import { appAuth } from "../_init";
import { logger } from "$lib/app";

export const authView = writable<"signin"|"signup"|"forgot">("signin");
export const currentUser = writable<User>();

if (browser) {
	onAuthStateChanged(appAuth, (user) => {
		logger.log('🔄 Auth state changed:', user);
        if(user){
            logger.log("User logged");
		    currentUser.set(user);
        }
	});
}