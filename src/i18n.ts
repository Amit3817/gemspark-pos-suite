import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { englishTranslations } from './contexts/translations/english';
import { hindiTranslations } from './contexts/translations/hindi';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: englishTranslations
      },
      hi: {
        translation: hindiTranslations
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n; 