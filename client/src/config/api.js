/** Backend origin in production (no trailing slash). Empty = use Vite dev proxy. */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
