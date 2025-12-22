// reCAPTCHA utility functions for frontend integration
// This handles Google reCAPTCHA v3 integration

declare global {
  interface Window {
    grecaptcha: any;
  }
}

// Load reCAPTCHA script dynamically
export function loadRecaptcha(siteKey: string): Promise<void> {
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
      // Wait for grecaptcha to be ready
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

// Execute reCAPTCHA for a specific action
export async function executeRecaptcha(action: string): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    throw new Error("reCAPTCHA site key not configured");
  }

  if (!window.grecaptcha) {
    await loadRecaptcha(siteKey);
  }

  return new Promise((resolve, reject) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action })
        .then((token: string) => {
          resolve(token);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  });
}

// Verify reCAPTCHA token with backend
export async function verifyRecaptcha(
  token: string,
  action?: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/captcha/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "recaptcha",
        token,
        action,
      }),
    });

    const data = await response.json();
    return data.success && data.data?.success;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
}
