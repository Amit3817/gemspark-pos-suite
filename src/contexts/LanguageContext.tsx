
import { createContext, useContext, useState, ReactNode } from 'react';
import { englishTranslations } from './translations/english';
import { hindiTranslations } from './translations/hindi';

type Language = 'english' | 'hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  english: englishTranslations,
  hindi: hindiTranslations
} as const;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations.english];
    return translation || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
