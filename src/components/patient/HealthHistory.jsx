import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiClock, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { TRIAGE_COLORS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const TRIAGE_STYLES = {
  low: {
    dotClass: 'bg-green-500',
    label: 'Low urgency',
    labelKey: 'patient.history.lowUrgency',
  },
  medium: {
    dotClass: 'bg-orange-500',
    label: 'Medium urgency',
    labelKey: 'patient.history.mediumUrgency',
  },
  high: {
    dotClass: 'bg-red-500',
    label: 'High urgency',
    labelKey: 'patient.history.highUrgency',
  },
};

const HealthHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/patients/health-history');
      setSessions(response.data || []);
    } catch (err) {
      setError(t('patient.history.fetchError', 'Could not load your health history. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const toggleExpand = (sessionId) => {
    setExpandedId((prev) => (prev === sessionId ? null : sessionId));
  };

  const getTriageStyle = (level) => {
    const normalized = (level || '').toLowerCase();
    if (normalized === 'high' || normalized === 'emergency' || normalized === 'red') {
      return TRIAGE_STYLES.high;
    }
    if (normalized === 'medium' || normalized === 'moderate' || normalized === 'orange') {
      return TRIAGE_STYLES.medium;
    }
    return TRIAGE_STYLES.low;
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
            {t('patient.history.title', 'My Health History')}
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
              onClick={fetchHistory}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              {t('common.retry', 'Try Again')}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sessions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center space-y-3">
            <FiClock className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 text-lg">
              {t('patient.history.empty', 'No health records yet.')}
            </p>
            <p className="text-gray-400 text-sm">
              {t('patient.history.emptyHint', 'Use Healora when you feel unwell.')}
            </p>
          </div>
        )}

        {/* Sessions List */}
        {!loading && !error && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => {
              const sessionId = session.id || session._id;
              const isExpanded = expandedId === sessionId;
              const triageStyle = getTriageStyle(session.triageLevel);

              return (
                <div
                  key={sessionId}
                  className="bg-white rounded-2xl shadow-sm p-4 space-y-2"
                >
                  {/* Top Row: Date + Triage Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">
                      {formatDate(session.createdAt || session.date)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3 h-3 rounded-full inline-block ${triageStyle.dotClass}`}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {t(triageStyle.labelKey, triageStyle.label)}
                      </span>
                    </div>
                  </div>

                  {/* Symptoms Text */}
                  <p className="font-medium text-gray-800">
                    {session.symptoms || session.mainSymptoms || t('patient.history.noSymptoms', 'Symptoms not recorded')}
                  </p>

                  {/* Recommendation */}
                  {session.recommendation && (
                    <p className="text-gray-600 text-sm">
                      {session.recommendation}
                    </p>
                  )}

                  {/* Expandable Details */}
                  <button
                    onClick={() => toggleExpand(sessionId)}
                    className="flex items-center gap-1 text-green-600 text-sm font-medium hover:text-green-700 transition-colors w-full"
                    aria-expanded={isExpanded}
                    aria-controls={`details-${sessionId}`}
                  >
                    {isExpanded ? (
                      <>
                        <FiChevronDown className="w-4 h-4" />
                        {t('patient.history.hideDetails', 'Hide details')}
                      </>
                    ) : (
                      <>
                        <FiChevronRight className="w-4 h-4" />
                        {t('patient.history.viewDetails', 'View details')}
                      </>
                    )}
                  </button>

                  {isExpanded && (
                    <div
                      id={`details-${sessionId}`}
                      className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm text-gray-700"
                    >
                      {session.aiSummary && (
                        <div>
                          <span className="font-medium">
                            {t('patient.history.aiSummary', 'AI Summary:')}
                          </span>
                          <p className="mt-1">{session.aiSummary}</p>
                        </div>
                      )}

                      {session.guidance && (
                        <div>
                          <span className="font-medium">
                            {t('patient.history.guidance', 'Guidance:')}
                          </span>
                          <p className="mt-1">{session.guidance}</p>
                        </div>
                      )}

                      {session.facilityRecommendation && (
                        <div>
                          <span className="font-medium">
                            {t('patient.history.recommendedFacility', 'Recommended Facility:')}
                          </span>
                          <p className="mt-1">{session.facilityRecommendation}</p>
                        </div>
                      )}

                      <Link
                        to={`/patient/result/${sessionId}`}
                        className="inline-flex items-center gap-1 text-green-600 font-medium hover:text-green-700 mt-2"
                      >
                        {t('patient.history.viewFullReport', 'View full report')}
                        <FiChevronRight className="w-4 h-4" />
                      </Link>
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

export default HealthHistory;
