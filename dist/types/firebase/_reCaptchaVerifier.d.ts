import type { Auth, RecaptchaVerifier as RecaptchaVerifierType } from "firebase/auth";
export declare function getRecaptchaVerifier(auth: Auth): Promise<RecaptchaVerifierType>;
