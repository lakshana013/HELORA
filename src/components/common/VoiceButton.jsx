import { useTranslation } from 'react-i18next';
import { FiMic } from 'react-icons/fi';
import useVoiceInput from '../../hooks/useVoiceInput.js';

const LANG_MAP = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN' };

export default function VoiceButton({ onResult, language = 'en', size = 'lg' }) {
  const { t, i18n } = useTranslation();
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported, error } = useVoiceInput();

  const langCode = LANG_MAP[language] || LANG_MAP[i18n.language] || 'en-IN';
  const sizeClasses = size === 'xl' ? 'w-32 h-32 text-5xl' : 'w-20 h-20 text-3xl';

  const handlePress = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening(langCode);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-yellow-50 rounded-xl text-yellow-700">
        <p>{t('patient.type_instead')}</p>
      </div>
    );
  }

  if (transcript && !isListening) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500 mb-2">{t('patient.you_said')}</p>
        <p className="text-lg font-medium text-gray-900 mb-6">"{transcript}"</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { onResult(transcript); resetTranscript(); }}
            className="btn-primary"
          >
            {t('patient.thats_correct')}
          </button>
          <button
            onClick={resetTranscript}
            className="btn-secondary"
          >
            {t('patient.try_again')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handlePress}
        className={`${sizeClasses} flex items-center justify-center rounded-full transition-all ${
          isListening
            ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
        }`}
        aria-label={isListening ? t('patient.listening') : t('patient.tap_and_speak')}
      >
        <FiMic />
      </button>
      <p className="text-lg text-gray-600 font-medium">
        {isListening ? t('patient.listening') : t('patient.tap_and_speak')}
      </p>
      {error && <p className="text-sm text-red-500">{t('patient.didnt_understand')}</p>}
    </div>
  );
}
