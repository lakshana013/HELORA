import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LOCATION_DATA } from '../../utils/offlineMedicalDb.js';
import { FiMapPin, FiChevronDown } from 'react-icons/fi';

export default function LocationFallback({ onLocationSelected }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [stateIdx, setStateIdx] = useState(-1);
  const [districtIdx, setDistrictIdx] = useState(-1);
  const [village, setVillage] = useState('');

  const states = LOCATION_DATA.states;
  const districts = stateIdx >= 0 ? states[stateIdx].districts : [];
  const villages = districtIdx >= 0 ? districts[districtIdx].villages : [];

  const getName = (obj) => obj?.name?.[lang] || obj?.name?.en || '';

  const handleConfirm = () => {
    if (stateIdx < 0 || districtIdx < 0) return;
    onLocationSelected({
      state: getName(states[stateIdx]),
      district: getName(districts[districtIdx]),
      village: village || null,
    });
  };

  const selectClass = 'w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-base appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10';

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
          <FiMapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t('offline.select_location') || 'Select Your Location'}</h3>
          <p className="text-xs text-gray-500">{t('offline.gps_unavailable') || 'GPS is unavailable. Please select manually.'}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <select
            value={stateIdx}
            onChange={(e) => { setStateIdx(+e.target.value); setDistrictIdx(-1); setVillage(''); }}
            className={selectClass}
          >
            <option value={-1}>{t('offline.select_state') || 'Select State'}</option>
            {states.map((s, i) => (
              <option key={i} value={i}>{getName(s)}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {stateIdx >= 0 && (
          <div className="relative">
            <select
              value={districtIdx}
              onChange={(e) => { setDistrictIdx(+e.target.value); setVillage(''); }}
              className={selectClass}
            >
              <option value={-1}>{t('offline.select_district') || 'Select District'}</option>
              {districts.map((d, i) => (
                <option key={i} value={i}>{getName(d)}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        )}

        {districtIdx >= 0 && villages.length > 0 && (
          <div className="relative">
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className={selectClass}
            >
              <option value="">{t('offline.select_village') || 'Select Village (Optional)'}</option>
              {villages.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        )}

        {districtIdx >= 0 && (
          <button
            onClick={handleConfirm}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiMapPin className="w-4 h-4" />
            {t('offline.confirm_location') || 'Confirm Location'}
          </button>
        )}
      </div>
    </div>
  );
}
