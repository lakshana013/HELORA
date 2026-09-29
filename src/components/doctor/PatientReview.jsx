import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiSearch, FiUser, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../../utils/api.js';

const MOCK_PATIENTS = [
  { id: '1', name: 'Lakshmi Devi', age: 35, gender: 'female', phone: '9876543210', session_count: 3, last_triage: 'orange', last_visit: '2024-09-20' },
  { id: '2', name: 'Ravi Kumar', age: 52, gender: 'male', phone: '9876543220', session_count: 5, last_triage: 'green', last_visit: '2024-09-18' },
  { id: '3', name: 'Meena Sundaram', age: 28, gender: 'female', phone: '9876543230', session_count: 1, last_triage: 'red', last_visit: '2024-09-22' },
  { id: '4', name: 'Venkatesh R.', age: 67, gender: 'male', phone: '9876543240', session_count: 8, last_triage: 'orange', last_visit: '2024-09-15' },
  { id: '5', name: 'Priya Mohan', age: 41, gender: 'female', phone: '9876543250', session_count: 2, last_triage: 'green', last_visit: '2024-09-19' },
  { id: '6', name: 'Suresh B.', age: 45, gender: 'male', phone: '9876543260', session_count: 4, last_triage: 'orange', last_visit: '2024-09-17' },
  { id: '7', name: 'Anitha K.', age: 33, gender: 'female', phone: '9876543270', session_count: 1, last_triage: 'green', last_visit: '2024-09-21' },
  { id: '8', name: 'Manoj P.', age: 58, gender: 'male', phone: '9876543280', session_count: 6, last_triage: 'orange', last_visit: '2024-09-14' },
];

export default function PatientReview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/api/doctors/patients').then(r => {
      if (r.data?.length) setPatients(r.data);
    }).catch(() => {});
  }, []);

  const filtered = patients.filter(p => (p.name || p.patient_name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/doctor')} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"><FiArrowLeft className="text-xl" /></button>
        <h1 className="text-xl font-bold text-gray-900">{t('doctor_dashboard.patients')}</h1>
      </div>

      <div className="px-6 pt-4 max-w-4xl mx-auto">
        <div className="relative mb-4">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('common.search')}
            className="w-full bg-white border rounded-xl pl-10 pr-4 py-3 text-base outline-none focus:ring-2 focus:ring-green-300" />
        </div>

        <div className="space-y-3">
          {filtered.map(p => {
            const isExpanded = expandedId === p.id;
            return (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : p.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><FiUser className="text-gray-400" /></div>
                    <div>
                      <p className="font-semibold text-gray-900">{p.name || p.patient_name}</p>
                      <p className="text-sm text-gray-500">{p.age} yrs · {p.gender} · {p.session_count} sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${p.last_triage === 'red' ? 'bg-red-500' : p.last_triage === 'orange' ? 'bg-orange-400' : 'bg-green-400'}`} />
                    {isExpanded ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t px-4 py-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{p.phone}</span></div>
                      <div><span className="text-gray-500">Last visit:</span> <span className="font-medium">{p.last_visit || 'N/A'}</span></div>
                      <div><span className="text-gray-500">Sessions:</span> <span className="font-medium">{p.session_count}</span></div>
                      <div><span className="text-gray-500">Last triage:</span> <span className={`font-medium capitalize ${p.last_triage === 'red' ? 'text-red-600' : p.last_triage === 'orange' ? 'text-orange-600' : 'text-green-600'}`}>{p.last_triage}</span></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
