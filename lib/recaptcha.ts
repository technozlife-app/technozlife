const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

let loadingPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (!SITE_KEY)
    return Promise.reject(new Error("RECAPTCHA site key not configured"));
  if (typeof window === "undefined")
    return Promise.reject(new Error("Cannot load recaptcha on server"));

  if ((window as any).grecaptcha) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-recaptcha]`);
    if (existing) {
      // Wait briefly for grecaptcha to initialize
      const interval = setInterval(() => {
        if ((window as any).grecaptcha) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        if (!(window as any).grecaptcha)
          reject(new Error("grecaptcha load timeout"));
      }, 5000);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-recaptcha", "true");
    script.onload = () => {
      // grecaptcha should be available after load
      if ((window as any).grecaptcha) {
        resolve();
      } else {
        // sometimes grecaptcha initializes slightly later
        const interval = setInterval(() => {
          if ((window as any).grecaptcha) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          if (!(window as any).grecaptcha)
            reject(new Error("grecaptcha not available after load"));
        }, 5000);
      }
    };
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA script"));
    document.head.appendChild(script);
  });

  return loadingPromise;
}

export async function executeRecaptcha(action: string): Promise<string> {
  if (!SITE_KEY) throw new Error("RECAPTCHA site key not configured");
  await loadRecaptchaScript();
  if (typeof window === "undefined")
    throw new Error("Cannot execute recaptcha on server");
  const grecaptcha = (window as any).grecaptcha;
  if (!grecaptcha || !grecaptcha.execute)
    throw new Error("grecaptcha not available");

  return grecaptcha.execute(SITE_KEY, { action });
}

export default { executeRecaptcha };
