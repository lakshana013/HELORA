import { useState, useCallback, useEffect, useRef } from 'react';

const LANG_CODES = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
};

export default function useVoiceOutput() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text, language = 'en') => {
    if (!isSupported || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = LANG_CODES[language] || 'en-IN';
    utterance.lang = langCode;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang === langCode)
      || voices.find((v) => v.lang.startsWith(langCode.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    isSpeaking,
    speak,
    stop,
    isSupported,
  };
}
