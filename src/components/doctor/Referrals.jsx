import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiSend, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const MOCK_REFERRALS = [
  { id: 'r1', patient_name: 'Ravi Kumar', age: 52, to_facility: 'Chennai Government Hospital', to_specialization: 'Cardiology', reason: 'Chest pain with exertion, needs cardiac evaluation', urgency: 'urgent', status: 'pending', created_at: '2024-09-22' },
  { id: 'r2', patient_name: 'Venkat R.', age: 67, to_facility: 'Apollo Clinic Adyar', to_specialization: 'Endocrinology', reason: 'Uncontrolled diabetes, medication adjustment needed', urgency: 'normal', status: 'accepted', created_at: '2024-09-20' },
  { id: 'r3', patient_name: 'Priya M.', age: 41, to_facility: 'Tambaram Government Hospital', to_specialization: 'Orthopedics', reason: 'Chronic joint pain, possible arthritis evaluation', urgency: 'routine', status: 'pending', created_at: '2024-09-19' },
  { id: 'r4', patient_name: 'Suresh B.', age: 45, to_facility: 'SRMC Emergency Centre', to_specialization: 'Gastroenterology', reason: 'Persistent stomach pain with blood in stool', urgency: 'urgent', status: 'completed', created_at: '2024-09-15' },
  { id: 'r5', patient_name: 'Anitha K.', age: 33, to_facility: 'Siddha Clinic Mylapore', to_specialization: 'AYUSH', reason: 'Skin condition - chronic eczema, seeking traditional remedy', urgency: 'routine', status: 'accepted', created_at: '2024-09-18' },
];

const URGENCY_COLORS = { urgent: 'bg-red-100 text-red-700', normal: 'bg-orange-100 text-orange-700', routine: 'bg-green-100 text-green-700' };
const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', accepted: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };

export default function Referrals() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [referrals] = useState(MOCK_REFERRALS);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = filter === 'all' ? referrals : referrals.filter(r => r.status === filter);
  const pendingCount = referrals.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/doctor')} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"><FiArrowLeft className="text-xl" /></button>
        <h1 className="text-xl font-bold text-gray-900">{t('doctor_dashboard.referrals')}</h1>
        <span className="text-sm text-gray-500">{pendingCount} pending · {referrals.length} total</span>
      </div>

      <div className="px-6 pt-4 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4">
          {['all', 'pending', 'accepted', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === s ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(ref => {
            const isExpanded = expandedId === ref.id;
            return (
              <div key={ref.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : ref.id)}>
                  <div>
                    <p className="font-semibold text-gray-900">{ref.patient_name}, {ref.age}y</p>
                    <p className="text-sm text-gray-600 mt-1"><FiSend className="inline mr-1" />{ref.to_facility} — {ref.to_specialization}</p>
                    <p className="text-sm text-gray-500 mt-1">{ref.reason}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${URGENCY_COLORS[ref.urgency]}`}>{ref.urgency}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[ref.status]}`}>{ref.status}</span>
                    {isExpanded ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t mt-3 pt-3 text-sm text-gray-500">
                    <p>Referred on: {ref.created_at}</p>
                    <p>Facility: {ref.to_facility}</p>
                    <p>Specialization: {ref.to_specialization}</p>
                    <p>Reason: {ref.reason}</p>
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
