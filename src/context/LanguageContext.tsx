'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { ml } from '../locales/ml';

type Locale = 'en' | 'ml';
type Translations = typeof en;

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    useEffect(() => {
        // Load saved locale
        const saved = localStorage.getItem('vallaroo_locale') as Locale;
        if (saved && (saved === 'en' || saved === 'ml')) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('vallaroo_locale', newLocale);
        // Optional: Document direction change strictly not needed for Malayalam (LTR)
    };

    const t = (key: keyof Translations, params?: Record<string, string | number>) => {
        const translations = locale === 'ml' ? ml : en;
        let text = (translations as any)[key] || en[key] || key;

        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, String(v));
            });
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
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
