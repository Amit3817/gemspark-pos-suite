import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { englishTranslations } from './translations/english';
import { hindiTranslations } from './translations/hindi';

// Types
export type Language = 'english' | 'hindi';
type TranslationKey = keyof typeof englishTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Constants
const TRANSLATIONS = {
  english: englishTranslations,
  hindi: hindiTranslations
} as const;

// Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider Component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage or default to 'english'
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return (savedLanguage && (savedLanguage === 'english' || savedLanguage === 'hindi')) 
      ? savedLanguage 
      : 'english';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Force a re-render of components using translations
    document.documentElement.lang = language;
  }, [language]);

  // Wrapper for setLanguage to ensure type safety
  const setLanguage = useCallback((newLanguage: Language) => {
    if (newLanguage === 'english' || newLanguage === 'hindi') {
      setLanguageState(newLanguage);
    } else {
      console.warn('Invalid language:', newLanguage);
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    try {
      // First try direct access (for dot notation keys)
      let translation = TRANSLATIONS[language][key as TranslationKey];
      
      // If not found, try nested access
      if (!translation) {
        const keyParts = key.split('.');
        let current: any = TRANSLATIONS[language];
        
        // Traverse the translations object using the key parts
        for (const part of keyParts) {
          if (current && typeof current === 'object' && part in current) {
            current = current[part];
          } else {
            console.warn(`Translation not found for key: ${key} in ${language}`);
            return key;
          }
        }
        
        translation = current;
      }
      
      // If we found a string translation, return it
      if (typeof translation === 'string') {
        if (!params) return translation;
        
        return Object.entries(params).reduce(
          (result, [param, value]) => result.replace(`{${param}}`, String(value)),
          translation
        );
      }
      
      console.warn(`Translation is not a string for key: ${key} in ${language}`);
      return key;
    } catch (error) {
      console.warn(`Translation error for key: ${key} in ${language}:`, error);
      return key;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
