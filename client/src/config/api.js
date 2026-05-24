/**
 * Backend origin for production (no trailing slash).
 * Local dev: leave VITE_API_URL empty — Vite proxies /api to localhost:5000.
 */
const raw = (import.meta.env.VITE_API_URL || '').trim();

// Fix common Amplify mistake: value pasted as "VITE_API_URL=https://..." instead of just the URL
const withoutKeyPrefix = raw.replace(/^VITE_API_URL\s*=\s*/i, '');

export const API_BASE_URL = withoutKeyPrefix.replace(/\/$/, '');

if (import.meta.env.DEV && raw && !withoutKeyPrefix.startsWith('http')) {
  console.warn(
    '[Smart AgriTech] VITE_API_URL must start with http:// or https://. Got:',
    raw
  );
}
