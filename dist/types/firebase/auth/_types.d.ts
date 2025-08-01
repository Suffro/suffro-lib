import type { Auth, User } from "firebase/auth";
export type FirebaseAuthMethods = {
    get: () => User;
    signout: (options?: {
        redirectUrl?: string;
        reload?: boolean;
    }) => Promise<void>;
    signup: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
    signin: (email: string, password: string, remember: boolean) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    reauthenticate: (email: string, currentPassword: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    updateEmail: (newEmail: string) => Promise<void>;
    googleAuth: (withRedirect?: boolean) => Promise<void>;
    githubAuth: (withRedirect?: boolean) => Promise<void>;
    isLoggedIn: () => boolean;
};
export type AuthState = {
    subscribe(callback: (user: User | null) => void): () => void;
    user(): User | null;
    logged(): boolean;
    get(): Auth;
};
