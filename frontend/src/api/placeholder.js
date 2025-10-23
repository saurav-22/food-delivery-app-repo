// Helper to build CloudFront image URLs while backend is not ready
export function getCdnUrl(key) {
  const base = import.meta.env.VITE_CLOUDFRONT_URL || '';
  if (!key) return '';
  if (!base) return `/${key}`; // falls back to relative path (dev)
  // Ensure no double slashes
  return `${base.replace(/\/+$/, '')}/${String(key).replace(/^\/+/, '')}`;
}
