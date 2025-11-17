"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "@/locales/en.json";
import pt from "@/locales/pt.json";

type Locale = "en" | "pt";

const translations: Record<Locale, any> = { en, pt };

interface I18nContextType {
  language: Locale;
  setLanguage: (language: Locale) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getNestedTranslation(language: string, key: string): string | undefined {
  return key.split('.').reduce((obj, k) => (obj ? obj[k] : undefined), translations[language as Locale]);
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Locale>("en");

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pt') {
      setLanguage('pt');
    }
  }, []);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    let translation = getNestedTranslation(language, key);

    if (!translation) {
      // Fallback to English if translation is missing
      translation = getNestedTranslation("en", key);
    }
    
    if (!translation) {
      return key; // Return key if no translation is found
    }

    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{{${rKey}}}`, String(replacements[rKey]));
      });
    }

    return translation;
  }, [language]);


  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
