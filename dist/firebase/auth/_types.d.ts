import type { User } from "firebase/auth";
export type FirebaseAuthMethods = {
    get: () => Promise<User>;
    signout: () => Promise<void>;
    signup: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
    signin: (email: string, password: string, remember: boolean) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    reauthenticate: (email: string, currentPassword: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    updateEmail: (newEmail: string) => Promise<void>;
    googleAuth: () => Promise<void>;
    githubAuth: () => Promise<void>;
    isLoggedIn: () => boolean;
};
