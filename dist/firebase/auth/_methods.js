"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAuthMethods = void 0;
const __1 = require("../../");
const auth_1 = require("firebase/auth");
const _getFsUser = (auth) => {
    if (!auth?.currentUser)
        throw new Error("User not found");
    return auth.currentUser;
};
const initAuthMethods = (auth) => ({
    signout: async function firebaseSignout(options) {
        try {
            __1.logger.logCaller();
            await (0, auth_1.signOut)(auth);
            try {
                await (0, __1.wait)(400);
                (0, __1.redirectOrReload)(options);
            }
            catch (error) {
                __1.logger.error(error);
            }
        }
        catch (err) {
            __1.logger.devError("Logout failed:", err);
        }
    },
    signup: async function firebaseSignup(email, password, passwordConfirmation, redirectPath) {
        try {
            __1.logger.logCaller();
            if (password != passwordConfirmation)
                throw new Error("Passwords do not match");
            await (0, auth_1.setPersistence)(auth, auth_1.browserLocalPersistence);
            const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
            __1.logger.log("User signed up:", userCredential.user);
        }
        catch (err) {
            __1.logger.devError("Signup error:", err);
        }
    },
    signin: async function firebaseSignin(email, password, remember, redirectPath) {
        try {
            __1.logger.logCaller();
            const persistence = remember
                ? auth_1.browserLocalPersistence
                : auth_1.browserSessionPersistence;
            await (0, auth_1.setPersistence)(auth, persistence);
            __1.logger.log("✅ persistence set");
            const userCredential = await (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
            __1.logger.log("✅ Signed in:", userCredential.user);
        }
        catch (err) {
            __1.logger.devError(err);
        }
    },
    forgotPassword: async function forgotPassword(email) {
        try {
            await (0, auth_1.sendPasswordResetEmail)(auth, email);
        }
        catch (error) {
            __1.logger.devError(error);
        }
    },
    googleAuth: async function googleAuth(withRedirect) {
        try {
            __1.logger.logCaller();
            const provider = new auth_1.GoogleAuthProvider();
            await (0, auth_1.setPersistence)(auth, auth_1.browserLocalPersistence);
            __1.logger.log("Auth persistence set");
            if (withRedirect) {
                console.log(`Starting Google auth [redirect]`);
                await (0, auth_1.signInWithRedirect)(auth, provider);
            }
            else {
                console.log(`Starting Google auth [popup]`);
                const result = await (0, auth_1.signInWithPopup)(auth, provider);
                const user = result?.user;
            }
        }
        catch (error) {
            __1.logger.devError("Google auth error:\n", error?.message);
        }
    },
    githubAuth: async function gitHubAuth(withRedirect) {
        try {
            __1.logger.logCaller();
            const provider = new auth_1.GithubAuthProvider();
            await (0, auth_1.setPersistence)(auth, auth_1.browserLocalPersistence);
            __1.logger.log("Auth persistence set");
            if (withRedirect) {
                console.log(`Starting GitHub auth [redirect]`);
                await (0, auth_1.signInWithRedirect)(auth, provider);
            }
            else {
                console.log(`Starting GitHub auth [popup]`);
                const result = await (0, auth_1.signInWithPopup)(auth, provider);
                const user = result?.user;
            }
        }
        catch (error) {
            __1.logger.devError("GitHub auth error:\n", error?.message);
        }
    },
    isLoggedIn: () => {
        __1.logger.logCaller();
        if (!auth)
            return false;
        const currentUser = auth?.currentUser;
        __1.logger.log(currentUser);
        if (!currentUser)
            return false;
        const isAnonymus = currentUser?.isAnonymous;
        __1.logger.log(isAnonymus);
        if (isAnonymus)
            return false;
        const uid = currentUser?.uid;
        __1.logger.log(uid);
        if (!__1.validate.nonEmptyString(uid))
            return false;
        return true;
    },
    reauthenticate: async function reauthenticateUser(email, currentPassword) {
        __1.logger.logCaller();
        const user = auth?.currentUser;
        if (!user)
            throw "User is not authenticated.";
        const credential = auth_1.EmailAuthProvider.credential(email, currentPassword);
        await (0, auth_1.reauthenticateWithCredential)(user, credential);
    },
    updateEmail: async function updateUserEmail(newEmail) {
        __1.logger.logCaller();
        const user = auth?.currentUser;
        if (!user)
            throw "User is not authenticated.";
        await (0, auth_1.updateEmail)(user, newEmail);
    },
    updatePassword: async function updateUserPassword(newPassword) {
        __1.logger.logCaller();
        const user = auth?.currentUser;
        if (!user)
            throw "User is not authenticated.";
        await (0, auth_1.updatePassword)(user, newPassword);
    },
    get: function get() {
        __1.logger.logCaller();
        const user = auth?.currentUser;
        if (!user)
            throw "User is not authenticated.";
        return user;
    },
});
exports.initAuthMethods = initAuthMethods;
