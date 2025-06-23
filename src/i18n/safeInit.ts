
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Safe i18n initialization that doesn't rely on React context
export const initI18nSafely = () => {
  if (!i18n.isInitialized) {
    console.log('Initializing i18n safely...');
    
    // Simple fallback configuration
    const resources = {
      en: {
        translation: {
          // Basic translations
          "language": "Language",
          "english": "English",
          "spanish": "Español",
          "french": "Français"
        }
      }
    };

    i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      })
      .catch(error => {
        console.error('i18n initialization failed:', error);
      });
  }
};
