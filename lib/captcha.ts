// Simple wrapper that uses Google reCAPTCHA v3
declare global {
  interface Window {
    grecaptcha: any;
  }
}

// Load reCAPTCHA script dynamically
async function loadRecaptcha(siteKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const checkReady = () => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => resolve());
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };

    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.head.appendChild(script);
  });
}

export async function executeCaptcha(action = "submit") {
  const recaptchaKey = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
  if (!recaptchaKey) throw new Error("reCAPTCHA site key not configured");
  if (!window.grecaptcha) await loadRecaptcha(recaptchaKey);

  return new Promise<string>((resolve, reject) => {
    try {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(recaptchaKey, { action })
          .then((token: string) => resolve(token))
          .catch((err: any) => reject(err));
      });
    } catch (err) {
      reject(err);
    }
  });
}

