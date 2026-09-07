import en from './en.json';
import vi from './vi.json';
import zhCn from './zh-cn.json';
import ja from './ja.json';
import ko from './ko.json';

export const dictionaries = {
  en,
  vi,
  'zh-cn': zhCn,
  ja,
  ko,
  // Fallbacks for additional regional locales to base dictionaries
  'zh-tw': zhCn,
  es: en,
  de: en,
  fr: en,
  id: en,
  'pt-br': en,
  'pt-pt': en
};

export const supportedLanguages = [
  { id: 'en', native: 'English', english: 'English' },
  { id: 'ja', native: '日本語', english: 'Japanese' },
  { id: 'es', native: 'Español (España)', english: 'Spanish (Spain)' },
  { id: 'pt-br', native: 'Português (Brasil)', english: 'Portuguese (Brazil)' },
  { id: 'pt-pt', native: 'Português (Portugal)', english: 'Portuguese (Portugal)' },
  { id: 'zh-tw', native: '繁體中文', english: 'Traditional Chinese' },
  { id: 'ko', native: '한국어', english: 'Korean' },
  { id: 'id', native: 'Indonesian', english: 'Indonesian' },
  { id: 'vi', native: 'Tiếng Việt', english: 'Vietnamese' },
  { id: 'zh-cn', native: '简体中文', english: 'Simplified Chinese' },
  { id: 'fr', native: 'Français', english: 'French' },
  { id: 'de', native: 'Deutsch', english: 'German' }
];
