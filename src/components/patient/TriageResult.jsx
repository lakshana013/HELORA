import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiVolume2, FiMapPin, FiPhone, FiNavigation, FiSend, FiHeart } from 'react-icons/fi';
import api from '../../utils/api.js';
import useVoiceOutput from '../../hooks/useVoiceOutput.js';
import useLocation from '../../hooks/useLocation.js';
import { TRIAGE_COLORS } from '../../utils/constants.js';

const TRIAGE_CONFIG = {
  green: { emoji: '🟢', labelKey: 'triage.low_urgency', descKey: 'triage.low_urgency_desc', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  orange: { emoji: '🟠', labelKey: 'triage.needs_attention', descKey: 'triage.needs_attention_desc', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  red: { emoji: '🔴', labelKey: 'triage.emergency', descKey: 'triage.emergency_desc', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
};

export default function TriageResult() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const voiceOutput = useVoiceOutput();
  const location = useLocation();

  const [session, setSession] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    try {
      const [sessionRes, facilityRes] = await Promise.all([
        api.get(`/api/triage/session/${sessionId}`).catch(() => null),
        api.get(`/api/facilities${location.location ? `?lat=${location.location.lat}&lng=${location.location.lng}` : ''}`).catch(() => ({ data: [] })),
      ]);
      if (sessionRes?.data) setSession(sessionRes.data);
      setFacilities((facilityRes?.data || []).slice(0, 3));
    } catch {} finally {
      setLoading(false);
    }
  };

  const triageLevel = session?.triage_level || 'green';
  const config = TRIAGE_CONFIG[triageLevel] || TRIAGE_CONFIG.green;

  const speakGuidance = () => {
    const text = `${t(config.labelKey)}. ${t(config.descKey)}. ${session?.recommended_action || ''}`;
    voiceOutput.speak(text, i18n.language);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/patient')} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl">
          <FiArrowLeft className="text-xl" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t('triage.your_guidance')}</h1>
      </div>

      <div className="px-6 pt-6 max-w-lg mx-auto space-y-6">
        <div className={`${config.bg} border ${config.border} rounded-2xl p-6 text-center`}>
          <span className="text-4xl">{config.emoji}</span>
          <h2 className={`text-xl font-bold mt-3 ${config.text}`}>{t(config.labelKey)}</h2>
          <p className="text-gray-600 mt-2">{t(config.descKey)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">{t('triage.based_on_info')}</p>
          <p className="text-gray-800 font-medium">"{session?.symptoms_text || ''}"</p>
          {session?.recommended_action && (
            <p className="text-gray-600 mt-3">{session.recommended_action}</p>
          )}
        </div>

        <button onClick={speakGuidance} className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 rounded-2xl p-4 font-medium text-lg border border-green-200">
          <FiVolume2 className="text-xl" /> {t('triage.want_to_hear')}
        </button>

        {triageLevel !== 'red' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">{t('triage.who_can_help')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/patient/medicines" className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100">
                <span className="text-2xl">💊</span>
                <span className="text-sm font-medium text-blue-700">{t('triage.modern_medicine')}</span>
              </Link>
              <Link to="/patient/ayurveda" className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100">
                <span className="text-2xl">🌿</span>
                <span className="text-sm font-medium text-green-700">{t('triage.ayurveda')}</span>
              </Link>
            </div>
          </div>
        )}

        {facilities.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">{t('facilities.nearby_care')}</h3>
            <div className="space-y-3">
              {facilities.map((f) => (
                <div key={f.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{f.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{t(`facilities.${f.type}`) || f.type}</p>
                      {f.distance && <p className="text-sm text-green-600 mt-1">{f.distance} {t('facilities.km_away')}</p>}
                    </div>
                    <span className="text-2xl">🏥</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a href={`https://maps.google.com/?q=${f.lat},${f.lng}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-700 rounded-xl py-2 text-sm font-medium">
                      <FiNavigation /> {t('triage.get_directions')}
                    </a>
                    {f.phone && (
                      <a href={`tel:${f.phone}`} className="flex items-center justify-center gap-1 bg-blue-50 text-blue-700 rounded-xl px-4 py-2 text-sm font-medium">
                        <FiPhone /> {t('triage.call')}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/patient/facilities" className="block text-center text-green-600 font-medium mt-4 hover:underline">
              {t('patient.find_care')} →
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={async () => { try { await api.post('/api/triage/send-to-doctor', { session_id: sessionId }); alert('Sent!'); } catch {} }}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <FiSend /> {t('triage.send_to_doctor')}
          </button>
          <Link to="/patient" className="btn-primary text-center flex items-center justify-center gap-2">
            <FiHeart /> {t('nav.home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
