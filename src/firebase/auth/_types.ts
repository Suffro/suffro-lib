import type { Auth } from "firebase/auth";
import type { FStore } from "../firestore/_types";

//////////////////// TYPE ////////////////////
export type FirebaseAuthService = {
	signout: (auth: Auth) => Promise<void>;
	signup: (auth: Auth, email: string, password: string, passwordConfirmation: string) => Promise<void>;
	signin: (auth: Auth, email: string, password: string, remember: boolean) => Promise<void>;
	forgotPassword: (auth: Auth, email: string) => Promise<void>;
	googleAuth: (auth: Auth) => Promise<void>;
	gitHubAuth: (auth: Auth) => Promise<void>;
};