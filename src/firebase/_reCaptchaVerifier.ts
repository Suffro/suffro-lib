import type { Auth, RecaptchaVerifier as RecaptchaVerifierType } from "firebase/auth";

// Global singleton
let recaptchaVerifier: RecaptchaVerifierType | null = null;

export async function getRecaptchaVerifier(auth: Auth): Promise<RecaptchaVerifierType> {
    if (typeof window === 'undefined') throw new Error("reCAPTCHA can only be used in the browser.");
    // Remove old instance
    if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
    }

    // Dynamically import the constructor (not the type)
    const { RecaptchaVerifier } = await import("firebase/auth");

    // Init reCaptcha component
    if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible"
        });
    }

    if (!recaptchaVerifier) throw new Error("Failed to create reCAPTCHA verifier");
    return recaptchaVerifier;
}
