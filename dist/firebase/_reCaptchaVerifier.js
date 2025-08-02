let recaptchaVerifier = null;
export async function getRecaptchaVerifier(auth) {
    if (typeof window === 'undefined')
        throw new Error("reCAPTCHA can only be used in the browser.");
    if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
    }
    const { RecaptchaVerifier } = await import("firebase/auth");
    if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible"
        });
    }
    if (!recaptchaVerifier)
        throw new Error("Failed to create reCAPTCHA verifier");
    return recaptchaVerifier;
}
