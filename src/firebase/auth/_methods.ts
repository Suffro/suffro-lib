import { logger, redirectOrReload, validate, wait } from "../../";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateEmail,
  updatePassword,
  type Auth,
  type User,
} from "firebase/auth";
import type { FirebaseAuthMethods } from "./_types";

const _getFsUser = (auth: Auth): User => {
  if (!auth?.currentUser) throw new Error("User not found");
  return auth.currentUser;
};

export const initAuthMethods = (auth: Auth): FirebaseAuthMethods => ({
  //////////////////// SIGNOUT ////////////////////
  signout: async function firebaseSignout(options?: {redirectUrl?: string; reload?: boolean}) {
    try {
      logger.logCaller();
      await signOut(auth);
      try{
        await wait(400);
        redirectOrReload(options);
      } catch(error) {
        logger.error(error);
      }
    } catch (err) {
      logger.devError("Logout failed:", err);
    }
  },

  //////////////////// SIGNUP ////////////////////
  signup: async function firebaseSignup(
    email: string,
    password: string,
    passwordConfirmation: string,
    redirectPath?: string
  ): Promise<void> {
    try {
      logger.logCaller();
      // pre-checks
      if (password != passwordConfirmation)
        throw new Error("Passwords do not match");
      //
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      logger.log("User signed up:", userCredential.user);
      //await goto(redirectPath||'/');
    } catch (err: any) {
      logger.devError("Signup error:", err);
    }
  },

  //////////////////// SIGNIN ////////////////////
  signin: async function firebaseSignin(
    email: string,
    password: string,
    remember: boolean,
    redirectPath?: string
  ): Promise<void> {
    try {
      logger.logCaller();
      const persistence = remember
        ? browserLocalPersistence // persist across sessions
        : browserSessionPersistence; // expires on tab close
      await setPersistence(auth, persistence);
      logger.log("✅ persistence set");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      logger.log("✅ Signed in:", userCredential.user);
      // await goto(redirectPath||'/');
    } catch (err: any) {
      logger.devError(err);
    }
  },

  //////////////////// FORGOT PASSWORD ////////////////////
  forgotPassword: async function forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      // do nothing (I dont want the user to know if the email exists or not)
      logger.devError(error);
    }
  },

  //////////////////// GOOGLE AUTH ////////////////////
  googleAuth: async function googleAuth(withRedirect?: boolean): Promise<void> {
    try {
      logger.logCaller();

      const provider = new GoogleAuthProvider();

      await setPersistence(auth, browserLocalPersistence);
      logger.log("Auth persistence set");

      if(withRedirect) {
        console.log(`Starting Google auth [redirect]`);
        await signInWithRedirect(auth, provider);
      } else {
        console.log(`Starting Google auth [popup]`);
        const result = await signInWithPopup(auth, provider);
        const user = result?.user;
        if(user) console.log('Signed in as:', user?.email);
      }
    } catch (error: any) {
      logger.devError("Google auth error:\n", error?.message);
    }
  },

  //////////////////// GITHUB AUTH ////////////////////
  githubAuth: async function gitHubAuth(withRedirect?: boolean): Promise<void> {
    try {
      logger.logCaller();

      const provider = new GithubAuthProvider();

      await setPersistence(auth, browserLocalPersistence);
      logger.log("Auth persistence set");

      if(withRedirect) {
        console.log(`Starting GitHub auth [redirect]`);
        await signInWithRedirect(auth, provider);
      } else {
        console.log(`Starting GitHub auth [popup]`);
        const result = await signInWithPopup(auth, provider);
        const user = result?.user;
        if(user) console.log('Signed in as:', user?.email);
      }

    } catch (error: any) {
      logger.devError("GitHub auth error:\n", error?.message);
    }
  },

  isLoggedIn: (): boolean => {
    logger.logCaller();

    if (!auth) return false;

    const currentUser: User = auth?.currentUser as User;
    logger.log(currentUser);
    if (!currentUser) return false;

    const isAnonymus: boolean = currentUser?.isAnonymous as boolean;
    logger.log(isAnonymus);
    if (isAnonymus) return false;

    const uid: string = currentUser?.uid as string;
    logger.log(uid);
    if (!validate.nonEmptyString(uid)) return false;

    return true;
  },
  // --- Helper: Reauthenticate with email/password ---
  reauthenticate: async function reauthenticateUser(
    email: string,
    currentPassword: string
  ) {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  },

  // --- Update Email ---
  updateEmail: async function updateUserEmail(newEmail: string) {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    await updateEmail(user, newEmail);
  },

  // --- Update Password ---
  updatePassword: async function updateUserPassword(newPassword: string) {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    await updatePassword(user, newPassword);
  },

  // --- Update Password ---
  get: function get() {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    return user;
  },
});

//////////////////// OBJECT ////////////////////
// export const _firebaseAuthMethods: FirebaseAuthMethods = {
// 	signout: firebaseSignout,
// 	signup: firebaseSignup,
// 	signin: firebaseSignin,
// 	forgotPassword,
// 	googleAuth,
// 	gitHubAuth
// };
