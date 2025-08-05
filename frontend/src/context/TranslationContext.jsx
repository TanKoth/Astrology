import React, { createContext, useState, useContext } from "react";
import { en } from "../utilityFunction/EnglishTranslator";
import { hi } from "../utilityFunction/HindiTranslator";

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const translations = {
    en,
    hi,
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "hi" : "en"));
  };

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage,
        t,
        toggleLanguage,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
