/**
 * API base URL for axios.
 * - Local dev: empty → Vite proxies /api to localhost:5000
 * - Amplify: empty → same-origin /api (proxied to EB in root amplify.yml)
 * - Direct EB: set VITE_API_URL to http://your-env.elasticbeanstalk.com (not https unless SSL is enabled on EB)
 */
const raw = (import.meta.env.VITE_API_URL || '').trim();
const withoutKeyPrefix = raw.replace(/^VITE_API_URL\s*=\s*/i, '').replace(/\/$/, '');

const isAmplifyHost = () => {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h.endsWith('amplifyapp.com') || h.includes('.amplifyapp.');
};

const resolveApiBase = () => {
  // Always use same-origin on Amplify so /api proxy works (avoids HTTPS→HTTP CORS/preflight/timeouts)
  if (isAmplifyHost()) {
    return '';
  }
  return withoutKeyPrefix;
};

export const API_BASE_URL = resolveApiBase();

if (import.meta.env.PROD && typeof window !== 'undefined') {
  console.info(
    '[Smart AgriTech] API:',
    API_BASE_URL || `${window.location.origin}/api (proxied to backend)`
  );
}

if (import.meta.env.DEV && raw && !withoutKeyPrefix.startsWith('http')) {
  console.warn(
    '[Smart AgriTech] VITE_API_URL must start with http:// or https://. Got:',
    raw
  );
}
