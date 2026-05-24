/**
 * Backend origin — no trailing slash.
 * Local dev: leave empty (Vite proxies /api → localhost:5000).
 * Production (Amplify): set VITE_API_URL to your Elastic Beanstalk URL.
 *
 * Example:
 *   http://smart-agritech-env.eba-mjmv3nxz.us-east-1.elasticbeanstalk.com
 */
const raw = (import.meta.env.VITE_API_URL || '').trim();

// Fix mistaken Amplify paste: "VITE_API_URL=https://..." in the value field
const cleaned = raw.replace(/^VITE_API_URL\s*=\s*/i, '');

export const API_BASE_URL = cleaned.replace(/\/$/, '');

if (import.meta.env.PROD && typeof window !== 'undefined') {
  if (!API_BASE_URL) {
    console.error(
      '[Smart AgriTech] VITE_API_URL is missing. Set it in Amplify → Environment variables and redeploy.'
    );
  } else {
    console.info('[Smart AgriTech] API_BASE_URL:', API_BASE_URL);
  }
}

if (import.meta.env.DEV && API_BASE_URL && !API_BASE_URL.startsWith('http')) {
  console.warn('[Smart AgriTech] VITE_API_URL should start with http:// or https://');
}

/** Build full URL for fetch() if needed */
export const apiUrl = (path) => {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${p}` : p;
};
