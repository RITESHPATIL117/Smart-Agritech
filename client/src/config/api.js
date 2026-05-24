/**
 * API base URL for axios (origin only, no trailing slash).
 *
 * Local dev: leave VITE_API_URL empty → Vite proxies /api to localhost:5000.
 *
 * Amplify (HTTPS): MUST use empty baseURL + relative /api/... paths.
 * Amplify customRedirects proxy /api → Elastic Beanstalk (HTTP) server-side.
 * Browsers block HTTPS pages from calling http:// APIs (mixed content).
 */
const raw = (import.meta.env.VITE_API_URL || '').trim();
const cleaned = raw.replace(/^VITE_API_URL\s*=\s*/i, '').replace(/\/$/, '');

const isBrowser = typeof window !== 'undefined';
const isAmplifyHost =
  isBrowser &&
  (window.location.hostname.endsWith('amplifyapp.com') ||
    window.location.hostname.includes('.amplifyapp.'));
const isHttpsPage = isBrowser && window.location.protocol === 'https:';
const isInsecureBackend = cleaned.startsWith('http://');

/** HTTPS frontend cannot call HTTP backend — use same-origin /api proxy on Amplify */
const mustUseSameOriginProxy =
  isAmplifyHost || (isHttpsPage && isInsecureBackend);

export const API_BASE_URL = mustUseSameOriginProxy ? '' : cleaned;

if (import.meta.env.PROD && isBrowser) {
  if (mustUseSameOriginProxy) {
    console.info(
      '[Smart AgriTech] API: same-origin',
      `${window.location.origin}/api/*`,
      '(proxied to Elastic Beanstalk — required for HTTPS Amplify + HTTP backend)'
    );
    if (cleaned) {
      console.warn(
        '[Smart AgriTech] VITE_API_URL is set but ignored on HTTPS to avoid mixed content. Remove it in Amplify env vars.'
      );
    }
  } else if (API_BASE_URL) {
    console.info('[Smart AgriTech] API_BASE_URL:', API_BASE_URL);
  } else {
    console.warn('[Smart AgriTech] VITE_API_URL is empty.');
  }
}

export const apiUrl = (path) => {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${p}` : p;
};
