import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const HealthCamps = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/camps/upcoming');
      setCamps(response.data || []);
    } catch (err) {
      setError(t('patient.camps.fetchError', 'Could not load upcoming camps. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (campId) => {
    setRegisteringId(campId);
    try {
      await api.post(`/api/camps/${campId}/register`);
      setCamps((prev) =>
        prev.map((camp) =>
          (camp.id || camp._id) === campId
            ? { ...camp, isRegistered: true }
            : camp
        )
      );
    } catch (err) {
      alert(t('patient.camps.registerError', 'Could not register. Please try again.'));
    } finally {
      setRegisteringId(null);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label={t('common.back', 'Go back')}
          >
            <FiArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('patient.camps.title', 'Upcoming Health Camps')}
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Loading */}
        {loading && (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchCamps}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              {t('common.retry', 'Try Again')}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && camps.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center space-y-3">
            <FiCalendar className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 text-lg">
              {t('patient.camps.empty', 'No upcoming camps near you.')}
            </p>
            <p className="text-gray-400 text-sm">
              {t('patient.camps.checkLater', 'Check back later for new health camp announcements.')}
            </p>
          </div>
        )}

        {/* Camp List */}
        {!loading && !error && camps.length > 0 && (
          <div className="space-y-4">
            {camps.map((camp) => {
              const campId = camp.id || camp._id;
              const isRegistering = registeringId === campId;

              return (
                <div
                  key={campId}
                  className="bg-white rounded-2xl shadow-sm p-5 space-y-3"
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {camp.name}
                  </h3>

                  <div className="space-y-2">
                    {camp.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                        <span>{camp.location}</span>
                      </div>
                    )}

                    {camp.date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiCalendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
                        <span>{formatDate(camp.date)}</span>
                      </div>
                    )}

                    {camp.time && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiClock className="w-4 h-4 flex-shrink-0 text-gray-400" />
                        <span>{formatTime(camp.time)}</span>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  {camp.services && camp.services.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {camp.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Register / Registered */}
                  {camp.isRegistered ? (
                    <button
                      disabled
                      className="w-full h-12 bg-green-100 text-green-700 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 cursor-default"
                      aria-label={t('patient.camps.alreadyRegistered', 'Already registered for this camp')}
                    >
                      <span aria-hidden="true">&#10003;</span>
                      {t('patient.camps.registered', 'Registered')}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(campId)}
                      disabled={isRegistering}
                      className="w-full h-12 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      aria-label={t('patient.camps.registerFor', 'Register for {{name}}', { name: camp.name })}
                    >
                      {isRegistering
                        ? t('common.pleaseWait', 'Please wait...')
                        : t('patient.camps.register', 'Register')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCamps;
