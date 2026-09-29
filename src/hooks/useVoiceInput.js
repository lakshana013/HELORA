import { useState, useCallback, useRef, useEffect } from 'react';

const LANG_CODES = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
};

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export default function useVoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported = Boolean(getSpeechRecognition());

  const startListening = useCallback((language = 'en') => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANG_CODES[language] || 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
      setConfidence(0);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0];
      setTranscript(result.transcript);
      setConfidence(result.confidence);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'no-speech') {
        setError('No speech was detected. Please try again.');
      } else if (event.error === 'audio-capture') {
        setError('No microphone was found. Please check your device.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission was denied. Please allow access.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      setError('Could not start speech recognition. Please try again.');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
}
