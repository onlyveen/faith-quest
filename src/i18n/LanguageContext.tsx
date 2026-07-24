import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { strings, type LanguageCode, type Strings } from "./strings";
import { appConfig } from "../config/appConfig";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: Strings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(
    appConfig.defaultLanguage,
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: strings[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
