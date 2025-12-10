'use client';

import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();

    return (
        <div className="flex items-center">
            <div className="bg-white/90 backdrop-blur shadow-sm rounded-full px-1 py-1 flex items-center border border-gray-200">
                <button
                    onClick={() => setLocale('en')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${locale === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-blue-600'
                        }`}
                >
                    English
                </button>
                <button
                    onClick={() => setLocale('ml')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${locale === 'ml'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-blue-600'
                        }`}
                >
                    മലയാളം
                </button>
            </div>
        </div>
    );
}
