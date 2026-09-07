// Helper for Country Flags
export const getCountryFlag = (code) => {
  if (!code) return '🌐';
  const flags = {
    'US': '🇺🇸',
    'VN': '🇻🇳',
    'SG': '🇸🇬',
    'GB': '🇬🇧',
    'JP': '🇯🇵',
    'DE': '🇩🇪',
    'KR': '🇰🇷',
    'FR': '🇫🇷',
    'CA': '🇨🇦'
  };
  return flags[code.toUpperCase()] || '🌐';
};
