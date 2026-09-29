import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiMic, FiSend } from 'react-icons/fi';
import VoiceButton from '../common/VoiceButton.jsx';
import api from '../../utils/api.js';

export default function SymptomInput() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const mode = searchParams.get('mode') || 'voice';
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentMode, setCurrentMode] = useState(mode);

  const startTriage = async (symptomsText, voiceTranscript) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/triage/start', {
        language: i18n.language,
        symptoms_text: symptomsText,
        voice_transcript: voiceTranscript || null,
      });
      navigate(`/patient/chat/${res.data.session_id}`);
    } catch (err) {
      setError(err.message || t('common.error'));
      setLoading(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      startTriage(textInput.trim(), null);
    }
  };

  const handleVoiceResult = (transcript) => {
    startTriage(transcript, transcript);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl" aria-label={t('common.back')}>
          <FiArrowLeft className="text-xl" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t('patient.tell_what_happened')}</h1>
      </div>

      <div className="px-6 pt-8 max-w-lg mx-auto">
        <p className="text-gray-500 text-lg text-center mb-8">{t('patient.no_medical_words')}</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center">{error}</div>
        )}

        {currentMode === 'voice' ? (
          <div className="text-center">
            <VoiceButton onResult={handleVoiceResult} language={i18n.language} size="xl" />

            <div className="mt-8 bg-gray-50 rounded-2xl p-5">
              <p className="text-gray-400 text-sm whitespace-pre-line">{t('patient.speak_example')}</p>
            </div>

            <button
              onClick={() => setCurrentMode('text')}
              className="mt-6 text-green-600 font-medium hover:underline text-lg"
            >
              {t('patient.type_instead')}
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t('patient.type_placeholder')}
                className="input-field min-h-[160px] resize-none"
                rows={5}
                autoFocus
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FiSend /> {t('common.next')}
              </button>
            </form>

            <button
              onClick={() => setCurrentMode('voice')}
              className="mt-6 w-full text-center text-green-600 font-medium hover:underline text-lg flex items-center justify-center gap-2"
            >
              <FiMic /> {t('patient.speak')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
