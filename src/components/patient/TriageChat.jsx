import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiSend, FiMic, FiVolume2, FiCheck } from 'react-icons/fi';
import api from '../../utils/api.js';
import useVoiceInput from '../../hooks/useVoiceInput.js';
import useVoiceOutput from '../../hooks/useVoiceOutput.js';

const LANG_MAP = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN' };

function parseOptions(text) {
  const match = text.match(/\[OPTION:(.*?)\]/);
  if (!match) return { clean: text, options: [] };
  const options = match[1].split('|').map((o) => o.trim());
  return { clean: text.replace(/\[OPTION:.*?\]/g, '').trim(), options };
}

function cleanTags(text) {
  return text.replace(/\[(EMERGENCY|TRIAGE:\w+|APPROACH:\w+|OPTION:[^\]]*)\]/g, '').trim();
}

export default function TriageChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const scrollRef = useRef(null);
  const voiceInput = useVoiceInput();
  const voiceOutput = useVoiceOutput();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [triageComplete, setTriageComplete] = useState(false);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = async () => {
    try {
      const res = await api.get(`/api/triage/session/${sessionId}`);
      setMessages(res.data?.messages || []);
      if (res.data?.triage_level) setTriageComplete(true);
    } catch {
      setMessages([
        { role: 'assistant', content: t('patient.what_bothering'), message_type: 'text' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;

    const userMsg = { role: 'user', content: text, message_type: 'text', timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await api.post('/api/triage/message', {
        session_id: sessionId,
        content: text,
        message_type: 'text',
      });

      const aiContent = res.data?.content || res.data?.message || "I understand. Let me ask you a few more questions.";

      if (aiContent.includes('[EMERGENCY]')) {
        setIsEmergency(true);
        navigate('/patient/emergency');
        return;
      }

      if (aiContent.includes('[TRIAGE:')) {
        setTriageComplete(true);
      }

      const aiMsg = { role: 'assistant', content: aiContent, message_type: 'text', timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg = { role: 'assistant', content: t('common.error') + '. ' + t('common.retry'), message_type: 'text' };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleOptionClick = (option) => {
    sendMessage(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleComplete = async () => {
    try {
      await api.post('/api/triage/complete', { session_id: sessionId });
      navigate(`/patient/result/${sessionId}`);
    } catch {
      navigate(`/patient/result/${sessionId}`);
    }
  };

  const speakText = (text) => {
    voiceOutput.speak(cleanTags(text), i18n.language);
  };

  const handleVoice = () => {
    if (voiceInput.isListening) {
      voiceInput.stopListening();
      if (voiceInput.transcript) {
        sendMessage(voiceInput.transcript);
      }
    } else {
      voiceInput.resetTranscript();
      voiceInput.startListening(LANG_MAP[i18n.language] || 'en-IN');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/patient')} className="p-2 hover:bg-gray-100 rounded-xl" aria-label={t('common.back')}>
          <FiArrowLeft className="text-xl" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">H</span>
          </div>
          <span className="font-semibold text-gray-900">Healora</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => {
          const isAI = msg.role === 'assistant';
          const { clean, options } = isAI ? parseOptions(msg.content) : { clean: msg.content, options: [] };
          const displayText = cleanTags(clean);

          return (
            <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] ${isAI ? '' : ''}`}>
                <div
                  className={`px-5 py-3 rounded-2xl text-base leading-relaxed ${
                    isAI
                      ? 'bg-green-50 text-gray-800 rounded-tl-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tr-sm'
                  }`}
                >
                  {displayText}
                </div>

                {isAI && (
                  <button onClick={() => speakText(msg.content)} className="mt-1 ml-2 text-gray-400 hover:text-green-600 p-1" aria-label={t('triage.listen')}>
                    <FiVolume2 className="text-sm" />
                  </button>
                )}

                {isAI && options.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => handleOptionClick(opt)}
                        className="btn-option"
                        disabled={sending}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-green-50 px-5 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {triageComplete && (
        <div className="px-4 py-3 bg-green-50 border-t border-green-200">
          <button onClick={handleComplete} className="btn-primary w-full flex items-center justify-center gap-2">
            <FiCheck /> {t('common.done')} — {t('triage.your_guidance')}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border-t px-4 py-3 flex gap-2 sticky bottom-0">
        {voiceInput.isSupported && (
          <button
            type="button"
            onClick={handleVoice}
            className={`p-3 rounded-xl transition-colors ${
              voiceInput.isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            aria-label={t('patient.speak')}
          >
            <FiMic className="text-xl" />
          </button>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('patient.type_placeholder')}
          className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-green-300"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="p-3 bg-green-600 text-white rounded-xl disabled:opacity-40 hover:bg-green-700 transition-colors"
          aria-label={t('common.next')}
        >
          <FiSend className="text-xl" />
        </button>
      </form>
    </div>
  );
}
