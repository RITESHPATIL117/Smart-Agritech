/**
 * Local dev: leave VITE_API_URL empty → Vite proxies /api to localhost:5000.
 * Amplify: leave VITE_API_URL empty → browser calls /api on same host (proxied to EB).
 */
const raw = (import.meta.env.VITE_API_URL || '').trim();
const cleaned = raw.replace(/^VITE_API_URL\s*=\s*/i, '').replace(/\/$/, '');

const onAmplify =
  typeof window !== 'undefined' &&
  window.location.hostname.includes('amplifyapp.com');

export const API_BASE_URL = onAmplify ? '' : cleaned;

if (typeof window !== 'undefined' && import.meta.env.PROD) {
  console.info(
    '[Smart AgriTech] API base:',
    API_BASE_URL || `${window.location.origin}/api (proxied to backend)`
  );
}

export const apiUrl = (path) => {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${p}` : p;
};
