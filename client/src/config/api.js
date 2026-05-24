/**
 * API origin (no trailing slash).
 * - Local dev: leave empty → Vite proxy /api → http://localhost:5000
 * - AWS frontend + local API (your laptop): VITE_API_URL=http://localhost:5000
 * - Full cloud: VITE_API_URL=https://your-api.example.com (must be HTTPS if frontend is HTTPS)
 */
const raw = (import.meta.env.VITE_API_URL || '').trim();
const cleaned = raw.replace(/^VITE_API_URL\s*=\s*/i, '');

export const API_BASE_URL = cleaned.replace(/\/$/, '');

if (import.meta.env.DEV && API_BASE_URL && !API_BASE_URL.startsWith('http')) {
  console.warn('[Smart AgriTech] VITE_API_URL should start with http:// or https://');
}

export const apiUrl = (path) => {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${p}` : p;
};
