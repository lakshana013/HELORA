import { useState, useCallback } from 'react';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  const requestLocation = useCallback(() => {
    if (!isSupported) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let message;
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'Location permission was denied. Please allow access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
          default:
            message = 'An unknown error occurred while getting your location.';
        }
        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  }, [isSupported]);

  return {
    location,
    error,
    loading,
    requestLocation,
    isSupported,
  };
}
