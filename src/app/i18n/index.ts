import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './resources/en.json';
import es from './resources/es.json';

export const defaultLanguage = 'es';

export const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
} as const;

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
    lng: defaultLanguage,
    react: {
      useSuspense: false,
    },
    resources,
  });
}

export default i18next;
