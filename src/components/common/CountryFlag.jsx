import React from 'react';

// Eagerly import all 260+ SVGs in assets/flags directory
const flagModules = import.meta.glob('../../assets/flags/*.svg', { eager: true, import: 'default' });

// Build a fast lookup dictionary by ISO code (e.g. 'US', 'VN', 'SG')
export const FLAG_MAP = {};
for (const path in flagModules) {
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  const code = filename.replace('.svg', '').toUpperCase();
  FLAG_MAP[code] = flagModules[path];
}

// Fallback flag
export const DEFAULT_FALLBACK_FLAG = FLAG_MAP['XX'] || FLAG_MAP['UN'] || FLAG_MAP['WW'] || Object.values(FLAG_MAP)[0] || '';

// Common aliases
if (FLAG_MAP['GB'] && !FLAG_MAP['UK']) {
  FLAG_MAP['UK'] = FLAG_MAP['GB'];
}
if (!FLAG_MAP['WW']) {
  FLAG_MAP['WW'] = DEFAULT_FALLBACK_FLAG;
}
FLAG_MAP['GLOBAL'] = DEFAULT_FALLBACK_FLAG;

/**
 * Get the SVG asset URL for a given country code (e.g. 'US', 'VN', 'SG').
 * Falls back to DEFAULT_FALLBACK_FLAG ('XX', 'UN', etc.).
 */
export function getCountryFlagUrl(code) {
  if (!code) return DEFAULT_FALLBACK_FLAG;
  const normalized = String(code).trim().toUpperCase();
  return FLAG_MAP[normalized] || DEFAULT_FALLBACK_FLAG;
}

/**
 * Reusable CountryFlag component that renders the crisp SVG flag image
 */
export default function CountryFlag({
  code,
  width = 18,
  height = 12,
  borderRadius = 2,
  style = {},
  className = '',
  title
}) {
  const flagUrl = getCountryFlagUrl(code);
  const fallbackUrl = DEFAULT_FALLBACK_FLAG;

  if (!flagUrl) {
    return <span style={{ fontSize: '13px', verticalAlign: 'middle', ...style }}>🌐</span>;
  }

  return (
    <img
      src={flagUrl}
      alt={code ? String(code).toUpperCase() : 'flag'}
      title={title || (code ? String(code).toUpperCase() : 'flag')}
      className={className}
      loading="lazy"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        objectFit: 'cover',
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        boxShadow: '0 0 1px rgba(0, 0, 0, 0.3)',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style
      }}
      onError={(e) => {
        if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
          e.currentTarget.src = fallbackUrl;
        }
      }}
    />
  );
}
