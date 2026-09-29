import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiMapPin, FiPhone, FiNavigation } from 'react-icons/fi';
import useGeoLocation from '../../hooks/useLocation.js';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const FILTER_TYPES = ['all', 'hospital', 'phc', 'clinic', 'ayush', 'emergency'];

const NearbyFacilities = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { location, error: locationError, loading: locationLoading, requestLocation } = useGeoLocation();

  const initialFilter = searchParams.get('filter') || 'all';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      fetchFacilities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, activeFilter]);

  const fetchFacilities = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const typeParam = activeFilter !== 'all' ? `&type=${activeFilter}` : '';
      const response = await api.get(
        `/api/facilities/nearby?lat=${location.lat}&lng=${location.lng}${typeParam}`
      );
      setFacilities(response.data || []);
    } catch (err) {
      setError(t('patient.facilities.fetchError', 'Could not load nearby facilities. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const openDirections = (facility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getFilterLabel = (filter) => {
    const labels = {
      all: t('patient.facilities.filterAll', 'All'),
      hospital: t('patient.facilities.filterHospital', 'Hospital'),
      phc: t('patient.facilities.filterPHC', 'PHC'),
      clinic: t('patient.facilities.filterClinic', 'Clinic'),
      ayush: t('patient.facilities.filterAYUSH', 'AYUSH'),
      emergency: t('patient.facilities.filterEmergency', 'Emergency'),
    };
    return labels[filter] || filter;
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
            {t('patient.facilities.title', 'Nearby Healthcare')}
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Location Request */}
        {!location && !locationLoading && (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-4">
            <FiMapPin className="w-12 h-12 text-green-600 mx-auto" />
            <p className="text-gray-600 text-lg">
              {t('patient.facilities.locationNeeded', 'We need your location to find nearby healthcare.')}
            </p>
            {locationError && (
              <p className="text-red-600 text-sm">{locationError}</p>
            )}
            <button
              onClick={requestLocation}
              className="w-full h-12 bg-green-600 text-white text-lg font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              aria-label={t('patient.facilities.allowLocation', 'Allow Location Access')}
            >
              <FiMapPin className="w-5 h-5" />
              {t('patient.facilities.allowLocation', 'Allow Location Access')}
            </button>
          </div>
        )}

        {locationLoading && (
          <div className="py-8">
            <LoadingSpinner text={t('patient.facilities.gettingLocation', 'Getting your location...')} />
          </div>
        )}

        {/* Filter Tabs */}
        {location && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label={t('patient.facilities.filterLabel', 'Filter facilities')}>
            {FILTER_TYPES.map((filter) => (
              <button
                key={filter}
                role="tab"
                aria-selected={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getFilterLabel(filter)}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchFacilities}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              {t('common.retry', 'Try Again')}
            </button>
          </div>
        )}

        {/* Facility List */}
        {!loading && !error && location && (
          <div className="space-y-4">
            {facilities.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">
                  {t('patient.facilities.empty', 'No facilities found nearby.')}
                </p>
              </div>
            ) : (
              facilities.map((facility) => (
                <div
                  key={facility.id || facility._id}
                  className="bg-white rounded-2xl shadow-sm p-4 space-y-2"
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {facility.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-sm font-medium">
                      {facility.type}
                    </span>
                    {facility.emergency_available && (
                      <span className="bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-sm font-medium">
                        {t('patient.facilities.emergencyCare', 'Emergency care available')}
                      </span>
                    )}
                  </div>

                  {facility.distance != null && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <FiMapPin className="w-4 h-4" />
                      <span>
                        {typeof facility.distance === 'number'
                          ? `${facility.distance.toFixed(1)} ${t('patient.facilities.kmAway', 'km away')}`
                          : facility.distance}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openDirections(facility)}
                      className="flex-1 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center gap-2 text-lg font-medium hover:bg-teal-700 transition-colors"
                      aria-label={t('patient.facilities.getDirections', 'Get directions to {{name}}', { name: facility.name })}
                    >
                      <FiNavigation className="w-5 h-5" />
                      {t('patient.facilities.directions', 'Directions')}
                    </button>
                    {facility.phone && (
                      <a
                        href={`tel:${facility.phone}`}
                        className="flex-1 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 text-lg font-medium hover:bg-green-700 transition-colors"
                        aria-label={t('patient.facilities.callFacility', 'Call {{name}}', { name: facility.name })}
                      >
                        <FiPhone className="w-5 h-5" />
                        {t('patient.facilities.call', 'Call')}
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyFacilities;
