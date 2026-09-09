/**
 * Centralized Theme, Accent Color, and Font Size Manager
 * Manages instant live switching across all CSS variables, data attributes, and root typography
 */

export const THEME_DEFINITIONS = {
  light: {
    '--apidog-bg': '#FFFFFF',
    '--apidog-sidebar-bg': '#EBEEF2',
    '--apidog-activity-bg': '#EBEEF2',
    '--apidog-card-bg': '#FFFFFF',
    '--apidog-border': '#DCE0E6',
    '--apidog-border-light': '#E8EAED',
    '--apidog-text-main': '#1F2937',
    '--apidog-text-muted': '#6B7280',
    '--apidog-text-dim': '#9CA3AF',
    '--bg-primary': '#FFFFFF',
    '--bg-secondary': '#F8F9FA',
    '--bg-card': '#FFFFFF',
    '--bg-input': '#FFFFFF',
    '--border-color': '#E5E7EB',
    '--text-main': '#1F2937',
    '--text-muted': '#6B7280',
    '--text-dim': '#9CA3AF'
  },
  dark_oled: {
    '--apidog-bg': '#121316',
    '--apidog-sidebar-bg': '#18191E',
    '--apidog-activity-bg': '#18191E',
    '--apidog-card-bg': '#15171B',
    '--apidog-border': '#292D36',
    '--apidog-border-light': '#20232A',
    '--apidog-text-main': '#F1F5F9',
    '--apidog-text-muted': '#94A3B8',
    '--apidog-text-dim': '#64748B',
    '--bg-primary': '#121316',
    '--bg-secondary': '#18191E',
    '--bg-card': '#15171B',
    '--bg-input': '#1C1F26',
    '--border-color': '#292D36',
    '--text-main': '#F1F5F9',
    '--text-muted': '#94A3B8',
    '--text-dim': '#64748B'
  },
  dark_navy: {
    '--apidog-bg': '#161922',
    '--apidog-sidebar-bg': '#1E222D',
    '--apidog-activity-bg': '#1E222D',
    '--apidog-card-bg': '#1B1E28',
    '--apidog-border': '#2C3343',
    '--apidog-border-light': '#232936',
    '--apidog-text-main': '#F1F5F9',
    '--apidog-text-muted': '#94A3B8',
    '--apidog-text-dim': '#64748B',
    '--bg-primary': '#161922',
    '--bg-secondary': '#1E222D',
    '--bg-card': '#1B1E28',
    '--bg-input': '#232836',
    '--border-color': '#2C3343',
    '--text-main': '#F1F5F9',
    '--text-muted': '#94A3B8',
    '--text-dim': '#64748B'
  },
  dark_charcoal: {
    '--apidog-bg': '#212327',
    '--apidog-sidebar-bg': '#2B2D33',
    '--apidog-activity-bg': '#2B2D33',
    '--apidog-card-bg': '#26282E',
    '--apidog-border': '#3A3D46',
    '--apidog-border-light': '#30333B',
    '--apidog-text-main': '#F1F5F9',
    '--apidog-text-muted': '#94A3B8',
    '--apidog-text-dim': '#64748B',
    '--bg-primary': '#212327',
    '--bg-secondary': '#2B2D33',
    '--bg-card': '#26282E',
    '--bg-input': '#2E3139',
    '--border-color': '#3A3D46',
    '--text-main': '#F1F5F9',
    '--text-muted': '#94A3B8',
    '--text-dim': '#64748B'
  },
  sepia: {
    '--apidog-bg': '#F6F1E6',
    '--apidog-sidebar-bg': '#EAE3D3',
    '--apidog-activity-bg': '#EAE3D3',
    '--apidog-card-bg': '#FAF6ED',
    '--apidog-border': '#DDD4C1',
    '--apidog-border-light': '#E5DCCB',
    '--apidog-text-main': '#2C261E',
    '--apidog-text-muted': '#796E5F',
    '--apidog-text-dim': '#9C8E7C',
    '--bg-primary': '#F6F1E6',
    '--bg-secondary': '#EAE3D3',
    '--bg-card': '#FAF6ED',
    '--bg-input': '#FFFFFF',
    '--border-color': '#DDD4C1',
    '--text-main': '#2C261E',
    '--text-muted': '#796E5F',
    '--text-dim': '#9C8E7C'
  }
};

export function applyTheme(themeMode) {
  const mode = themeMode || 'light';
  const def = THEME_DEFINITIONS[mode] || THEME_DEFINITIONS.light;
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.setAttribute('data-theme', mode);
    const root = document.documentElement;
    Object.entries(def).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('app_theme_mode', mode);
  }
}

export function applyAccentColor(accentColor) {
  const color = accentColor || '#8257E5';
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.setProperty('--apidog-purple', color);
    root.style.setProperty('--apidog-purple-hover', color);
    root.style.setProperty('--apidog-border-focus', color);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('app_accent_color', color);
  }
}

export function applyFontSize(fontSize) {
  if (typeof document !== 'undefined') {
    // CRITICAL: Clear any CSS zoom that multiplies 100vw/100vh causing window content to overflow off-screen!
    document.documentElement.style.removeProperty('zoom');
    document.body.style.removeProperty('zoom');
    document.documentElement.style.zoom = '1';
    document.body.style.zoom = '1';

    // Base font size is 13px at 100%
    const num = Number(fontSize) || 100;
    const calculatedPx = Math.round((13 * (num / 100)) * 10) / 10;
    document.documentElement.style.setProperty('--app-font-size', `${calculatedPx}px`);
    document.body.style.fontSize = `${calculatedPx}px`;
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('app_font_size', String(fontSize));
  }
}

export function initAppearanceSettings() {
  if (typeof window === 'undefined') return;
  const savedTheme = localStorage.getItem('app_theme_mode') || 'light';
  const savedAccent = localStorage.getItem('app_accent_color') || '#8257E5';
  const savedFontSize = Number(localStorage.getItem('app_font_size')) || 100;

  applyTheme(savedTheme);
  applyAccentColor(savedAccent);
  applyFontSize(savedFontSize);
}
