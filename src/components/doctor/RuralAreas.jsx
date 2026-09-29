import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiMap, FiList, FiUsers, FiMapPin, FiCalendar, FiPlus } from 'react-icons/fi';
import api from '../../utils/api.js';

const MOCK_AREAS = [
  { id: '1', village: 'Thiruvalluvar Nagar', population: 3200, patients: 45, nearest_facility: 'PHC Kelambakkam', distance_km: 3.2, last_camp: '2024-08-15', needs: 'General health, diabetes screening' },
  { id: '2', village: 'Kannapuram', population: 2100, patients: 32, nearest_facility: 'District Hospital', distance_km: 12.0, last_camp: '2024-06-20', needs: 'Maternal health, vaccinations' },
  { id: '3', village: 'Perumbakkam Colony', population: 4500, patients: 28, nearest_facility: 'CHC Medavakkam', distance_km: 5.1, last_camp: null, needs: 'Dental, eye check-up' },
  { id: '4', village: 'Semmancheri Village', population: 2800, patients: 51, nearest_facility: 'PHC Semmancheri', distance_km: 1.8, last_camp: '2024-09-01', needs: 'Blood pressure, general' },
  { id: '5', village: 'Neelankarai West', population: 1500, patients: 19, nearest_facility: 'Clinic Neelankarai', distance_km: 4.5, last_camp: '2024-07-10', needs: 'Ayurveda, wellness' },
  { id: '6', village: 'Palavakkam Rural', population: 3800, patients: 37, nearest_facility: 'District Hospital', distance_km: 8.7, last_camp: null, needs: 'Emergency training, first aid' },
  { id: '7', village: 'Injambakkam', population: 2200, patients: 23, nearest_facility: 'PHC Injambakkam', distance_km: 6.2, last_camp: '2024-05-15', needs: 'Nutrition, child health' },
  { id: '8', village: 'Uthandi Outskirts', population: 2900, patients: 41, nearest_facility: 'CHC Uthandi', distance_km: 7.8, last_camp: '2024-04-20', needs: 'Chronic disease management' },
];

function getUrgencyColor(lastCamp) {
  if (!lastCamp) return 'border-red-300 bg-red-50';
  const months = (Date.now() - new Date(lastCamp).getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (months > 6) return 'border-red-300 bg-red-50';
  if (months > 3) return 'border-orange-300 bg-orange-50';
  return 'border-green-200 bg-white';
}

export default function RuralAreas() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [areas, setAreas] = useState(MOCK_AREAS);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    api.get('/api/doctors/rural-areas').then(r => r.data && setAreas(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/doctor')} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"><FiArrowLeft className="text-xl" /></button>
        <h1 className="text-xl font-bold text-gray-900">{t('doctor_dashboard.rural_areas')}</h1>
      </div>

      <div className="px-6 pt-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              <FiList /> List
            </button>
            <button onClick={() => setViewMode('map')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              <FiMap /> Map
            </button>
          </div>
        </div>

        {viewMode === 'map' ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <FiMap className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Map integration coming soon</p>
            <div className="mt-6 relative bg-green-50 rounded-xl p-8 min-h-[300px]">
              {areas.map((a, i) => (
                <div key={a.id} className="absolute" style={{ left: `${15 + (i % 4) * 22}%`, top: `${15 + Math.floor(i / 4) * 40}%` }}>
                  <div className={`w-4 h-4 rounded-full ${!a.last_camp ? 'bg-red-500' : 'bg-green-500'}`} title={a.village} />
                  <span className="text-xs text-gray-600 block mt-1 whitespace-nowrap">{a.village}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {areas.map((area) => (
              <div key={area.id} className={`border-2 rounded-2xl p-5 transition-shadow hover:shadow-md ${getUrgencyColor(area.last_camp)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{area.village}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1"><FiUsers /> {area.patients} patients</span>
                      <span className="flex items-center gap-1"><FiMapPin /> {area.nearest_facility} ({area.distance_km} km)</span>
                      <span className="flex items-center gap-1"><FiCalendar /> {area.last_camp || 'No camp yet'}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{area.needs}</p>
                  </div>
                </div>
                <Link to={`/doctor/camps?area=${area.village}`} className="mt-3 inline-flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700">
                  <FiPlus /> {t('doctor_dashboard.plan_camp')}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
