import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationAM from './locales/am/translation.json';
import translationOM from './locales/om/translation.json';
import translationTI from './locales/ti/translation.json';

const resources = {
  en: { translation: translationEN },
  am: { translation: translationAM },
  om: { translation: translationOM },
  ti: { translation: translationTI },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
