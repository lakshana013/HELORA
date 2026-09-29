import React from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../utils/constants.js';

const LanguageSelector = ({ compact = false }) => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <div
      className={`flex items-center justify-center ${compact ? 'gap-1' : 'gap-2'}`}
      role="radiogroup"
      aria-label={t('common.selectLanguage')}
    >
      {LANGUAGES.map((lang) => {
        const isActive = currentLanguage === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            role="radio"
            aria-checked={isActive}
            aria-label={lang.label}
            className={`
              ${compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base'}
              rounded-full font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
              ${
                isActive
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }
            `}
          >
            {lang.nativeLabel}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSelector;
