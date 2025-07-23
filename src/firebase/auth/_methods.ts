import { logger, validate, wait } from '../../';
import {
	browserLocalPersistence,
	browserSessionPersistence,
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	GoogleAuthProvider,
	sendPasswordResetEmail,
	setPersistence,
	signInWithEmailAndPassword,
	signInWithPopup,
	signInWithRedirect,
	signOut,
	type Auth,
	type User
} from 'firebase/auth';
import type { FirebaseAuthService } from './_types';


//////////////////// SIGNOUT ////////////////////
export async function firebaseSignout(auth: Auth,redirectPath?: string) {
	try {
		await signOut(auth);
		await wait(400, ()=>{
			location.reload();
		});
	} catch (err) {
		logger.devError('Logout failed:', err);
	}
}

//////////////////// SIGNUP ////////////////////
export async function firebaseSignup(
	auth: Auth,
	email: string,
	password: string,
	passwordConfirmation: string,
	redirectPath?: string
): Promise<void> {
	try {
		// pre-checks
		if (password != passwordConfirmation) throw new Error('Passwords do not match');
		//
		await setPersistence(auth, browserLocalPersistence);
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		logger.log('User signed up:', userCredential.user);
		//await goto(redirectPath||'/');
	} catch (err: any) {
		logger.devError('Signup error:', err);
	}
}

//////////////////// SIGNIN ////////////////////
export async function firebaseSignin(auth: Auth, email: string, password: string, remember: boolean, redirectPath?: string): Promise<void> {
	try {
		const persistence = remember
			? browserLocalPersistence // persist across sessions
			: browserSessionPersistence; // expires on tab close
		await setPersistence(auth, persistence);
		logger.log("✅ persistence set");
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		logger.log('✅ Signed in:', userCredential.user);
		// await goto(redirectPath||'/');
	} catch (err: any) {
		logger.devError(err);
	}
}

//////////////////// FORGOT PASSWORD ////////////////////
export async function forgotPassword(auth: Auth, email: string): Promise<void> {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error: any) {
		// do nothing (I dont want the user to know if the email exists or not)
		logger.devError(error);
	}
}

//////////////////// GOOGLE AUTH ////////////////////
export async function googleAuth(auth: Auth, redirectPath?: string): Promise<void> {
	try {
		await wait(200);

		const provider = new GoogleAuthProvider();

		await setPersistence(auth, browserLocalPersistence);
		logger.log("✅ persistence set");

		await signInWithRedirect(auth, provider);
	} catch (error: any) {
		logger.devError('Google auth error:', error.message);
	}
}

//////////////////// GITHUB AUTH ////////////////////
export async function gitHubAuth(auth: Auth, redirectPath?: string): Promise<void> {
	try {
		await wait(200);
		
		const provider = new GithubAuthProvider();

		await setPersistence(auth, browserLocalPersistence);
		logger.log("✅ persistence set");
		
		await signInWithRedirect(auth, provider);
	} catch (error: any) {
		logger.devError('GitHub auth error:', error.message);
	}
}


export const isLoggedIn = (auth: Auth): boolean => {
	logger.log(auth)
	if(!auth) return false;

	const currentUser: User = auth?.currentUser as User;
	logger.log(currentUser)
	if(!currentUser) return false;

	const isAnonymus: boolean = currentUser?.isAnonymous as boolean;
	logger.log(isAnonymus)
	if(isAnonymus) return false;

	const uid: string = currentUser?.uid as string;
	logger.log(uid)
	if(!validate.nonEmptyString(uid)) return false;

	return true;
}


//////////////////// OBJECT ////////////////////
export const _firebaseAuthMethods: FirebaseAuthService = {
	signout: firebaseSignout,
	signup: firebaseSignup,
	signin: firebaseSignin,
	forgotPassword,
	googleAuth,
	gitHubAuth
};
