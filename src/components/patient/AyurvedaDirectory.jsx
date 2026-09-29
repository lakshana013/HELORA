import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiSearch, FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const AyurvedaDirectory = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const currentLanguage = i18n.language || 'en';

  const fetchHerbs = useCallback(async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await api.get(
        `/api/ayurveda?lang=${currentLanguage}${searchParam}`
      );
      setHerbs(response.data || []);
    } catch (err) {
      setError(t('patient.ayurveda.fetchError', 'Could not load Ayurveda information. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, [currentLanguage, t]);

  // Initial fetch
  useEffect(() => {
    fetchHerbs();
  }, [fetchHerbs]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHerbs(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchHerbs]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
            {t('patient.ayurveda.title', 'Ayurveda / AYUSH Information')}
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Notice Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <FiInfo className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800 text-sm">
            {t('patient.ayurveda.notice', 'Traditional use is different from clinically established treatment.')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('patient.ayurveda.searchPlaceholder', 'Search herbs and remedies...')}
            className="w-full h-12 rounded-xl border-2 border-gray-200 pl-12 pr-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
            aria-label={t('patient.ayurveda.searchLabel', 'Search Ayurveda herbs and remedies')}
          />
        </div>

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
              onClick={() => fetchHerbs(searchTerm)}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              {t('common.retry', 'Try Again')}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && herbs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">
              {t('patient.ayurveda.empty', 'No herbs found.')}
            </p>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-2">
                {t('patient.ayurveda.tryDifferent', 'Try a different search term.')}
              </p>
            )}
          </div>
        )}

        {/* Herb List */}
        {!loading && !error && herbs.length > 0 && (
          <div className="space-y-3">
            {herbs.map((herb) => {
              const herbId = herb.id || herb._id;
              const isExpanded = expandedId === herbId;

              return (
                <div
                  key={herbId}
                  className="bg-white rounded-2xl shadow-sm p-4"
                >
                  <button
                    onClick={() => toggleExpand(herbId)}
                    className="w-full flex items-start justify-between gap-3 text-left"
                    aria-expanded={isExpanded}
                    aria-controls={`herb-${herbId}`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span
                        className="text-2xl flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                        role="img"
                      >
                        🌿
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {herb.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {herb.traditionalUse || herb.description}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <FiChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    )}
                  </button>

                  {isExpanded && (
                    <div
                      id={`herb-${herbId}`}
                      className="mt-3 pt-3 border-t border-gray-100 space-y-3"
                    >
                      {herb.explanation && (
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm">
                            {t('patient.ayurveda.about', 'About')}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {herb.explanation}
                          </p>
                        </div>
                      )}

                      {herb.preparation && (
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm">
                            {t('patient.ayurveda.preparation', 'Preparation')}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {herb.preparation}
                          </p>
                        </div>
                      )}

                      {herb.safetyInfo && (
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm">
                            {t('patient.ayurveda.safety', 'Safety Information')}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {herb.safetyInfo}
                          </p>
                        </div>
                      )}

                      <div className="bg-green-50 rounded-lg p-2">
                        <p className="text-green-700 text-sm">
                          {t('patient.ayurveda.askProfessional', 'Ask an Ayurveda/AYUSH professional before use.')}
                        </p>
                      </div>
                    </div>
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

export default AyurvedaDirectory;
