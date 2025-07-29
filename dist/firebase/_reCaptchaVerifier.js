"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecaptchaVerifier = getRecaptchaVerifier;
// Global singleton
let recaptchaVerifier = null;
async function getRecaptchaVerifier(auth) {
    if (typeof window === 'undefined')
        throw new Error("reCAPTCHA can only be used in the browser.");
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
    if (!recaptchaVerifier)
        throw new Error("Failed to create reCAPTCHA verifier");
    return recaptchaVerifier;
}
//# sourceMappingURL=_reCaptchaVerifier.js.map