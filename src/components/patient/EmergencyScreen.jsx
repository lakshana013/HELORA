import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiAlertTriangle, FiMapPin, FiPhone, FiNavigation, FiArrowLeft } from 'react-icons/fi';
import useLocation from '../../hooks/useLocation.js';
import api from '../../utils/api.js';
import { EMERGENCY_NUMBER } from '../../utils/constants.js';

export default function EmergencyScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { location: userLoc, requestLocation } = useLocation();

  const [confirmed, setConfirmed] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  const handleConfirm = async () => {
    setConfirmed(true);
    setLoadingFacilities(true);
    try {
      if (!userLoc) requestLocation();
      const params = userLoc ? `?lat=${userLoc.lat}&lng=${userLoc.lng}&emergency=true` : '?emergency=true';
      const res = await api.get(`/api/facilities${params}`);
      setFacilities((res.data || []).slice(0, 5));
    } catch {
      setFacilities([]);
    } finally {
      setLoadingFacilities(false);
    }
  };

  if (!confirmed) {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertTriangle className="text-red-600 text-5xl" />
          </div>
          <h1 className="text-2xl font-bold text-red-800 mb-4">{t('emergency.need_help')}</h1>

          <div className="space-y-4 mt-8">
            <button onClick={handleConfirm} className="btn-emergency w-full text-xl py-5">
              {t('emergency.yes_get_help')}
            </button>
            <button onClick={() => navigate(-1)} className="w-full py-4 rounded-2xl border-2 border-gray-300 text-gray-600 text-lg font-medium hover:bg-gray-100">
              {t('emergency.no_go_back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 pb-8">
      <div className="bg-red-600 text-white px-6 py-6 text-center">
        <FiAlertTriangle className="text-4xl mx-auto mb-3" />
        <h1 className="text-2xl font-bold">{t('emergency.get_help_now')}</h1>
        <p className="text-red-100 mt-2">{t('emergency.symptoms_urgent')}</p>
      </div>

      <div className="px-6 pt-6 max-w-lg mx-auto space-y-4">
        <a href={`tel:${EMERGENCY_NUMBER}`} className="flex items-center gap-4 bg-red-600 text-white rounded-2xl p-5 text-lg font-semibold shadow-lg active:scale-95 transition-transform">
          <FiPhone className="text-2xl" />
          <div>
            <p>{t('emergency.call_emergency')}</p>
            <p className="text-red-200 text-sm">{EMERGENCY_NUMBER}</p>
          </div>
        </a>

        <button
          onClick={requestLocation}
          className="w-full flex items-center gap-4 bg-white border-2 border-red-200 text-red-700 rounded-2xl p-5 text-lg font-semibold"
        >
          <FiMapPin className="text-2xl" />
          <div className="text-left">
            <p>{t('emergency.share_location')}</p>
            {userLoc && <p className="text-sm text-gray-500">{userLoc.lat.toFixed(4)}, {userLoc.lng.toFixed(4)}</p>}
          </div>
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">{t('emergency.find_emergency')}</h2>
          {loadingFacilities ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : facilities.length > 0 ? (
            <div className="space-y-3">
              {facilities.map((f) => (
                <div key={f.id} className="border border-gray-100 rounded-xl p-4">
                  <p className="font-semibold text-gray-900">{f.name}</p>
                  {f.distance && <p className="text-sm text-red-600 font-medium">{f.distance} {t('facilities.km_away')}</p>}
                  {f.emergency_available ? (
                    <span className="inline-block mt-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{t('facilities.emergency_available')}</span>
                  ) : null}
                  <div className="flex gap-2 mt-3">
                    <a href={`https://maps.google.com/?q=${f.lat},${f.lng}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-700 rounded-xl py-2 text-sm font-medium">
                      <FiNavigation /> {t('facilities.directions')}
                    </a>
                    {f.phone && (
                      <a href={`tel:${f.phone}`} className="flex items-center justify-center gap-1 bg-red-600 text-white rounded-xl px-4 py-2 text-sm font-medium">
                        <FiPhone /> {t('triage.call')}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Enable location to find nearby hospitals.</p>
          )}
        </div>

        <button onClick={() => navigate('/patient')} className="w-full flex items-center justify-center gap-2 text-gray-500 py-4">
          <FiArrowLeft /> {t('common.back')}
        </button>
      </div>
    </div>
  );
}
