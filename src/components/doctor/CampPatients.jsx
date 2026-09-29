import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiUser, FiCheck, FiSend, FiEdit } from 'react-icons/fi';
import api from '../../utils/api.js';

const STATUS_COLORS = { registered: 'bg-blue-100 text-blue-700', waiting: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-orange-100 text-orange-700', completed: 'bg-green-100 text-green-700' };

const MOCK_PATIENTS = [
  { id: 'p1', patient_name: 'Lakshmi Devi', age: 35, gender: 'female', consultation_status: 'registered', last_symptoms: 'Fever and body pain', last_triage: 'orange' },
  { id: 'p2', patient_name: 'Ravi Kumar', age: 52, gender: 'male', consultation_status: 'waiting', last_symptoms: 'High blood pressure', last_triage: 'orange' },
  { id: 'p3', patient_name: 'Meena S.', age: 28, gender: 'female', consultation_status: 'in_progress', last_symptoms: 'Stomach pain', last_triage: 'green' },
  { id: 'p4', patient_name: 'Venkat R.', age: 67, gender: 'male', consultation_status: 'completed', last_symptoms: 'Diabetes checkup', last_triage: 'green' },
  { id: 'p5', patient_name: 'Priya M.', age: 41, gender: 'female', consultation_status: 'registered', last_symptoms: 'Joint pain for weeks', last_triage: 'orange' },
];

export default function CampPatients() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [camp, setCamp] = useState(null);
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    api.get(`/api/camps/${id}`).then(r => r.data && setCamp(r.data)).catch(() => {});
    api.get(`/api/camps/${id}/patients`).then(r => r.data?.length && setPatients(r.data)).catch(() => {});
  }, [id]);

  const filtered = filter === 'all' ? patients : patients.filter(p => p.consultation_status === filter);

  const updatePatient = async (patientId, updates) => {
    try {
      await api.put(`/api/camps/${id}/patients/${patientId}`, updates);
      setPatients(prev => prev.map(p => p.id === patientId || p.patient_id === patientId ? { ...p, ...updates } : p));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/doctor/camps')} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"><FiArrowLeft className="text-xl" /></button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{camp?.name || 'Health Camp'}</h1>
          {camp && <p className="text-sm text-gray-500">{camp.village_area} · {camp.date}</p>}
        </div>
      </div>

      <div className="px-6 pt-4 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {['all', 'registered', 'waiting', 'in_progress', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${filter === s ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}>
              {s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())} ({patients.filter(p => s === 'all' || p.consultation_status === s).length})
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(p => {
            const pid = p.id || p.patient_id;
            const isExpanded = expandedId === pid;
            return (
              <div key={pid} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : pid)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><FiUser className="text-gray-400" /></div>
                      <div>
                        <p className="font-semibold text-gray-900">{p.patient_name}</p>
                        <p className="text-sm text-gray-500">{p.age} yrs, {p.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${p.last_triage === 'red' ? 'bg-red-500' : p.last_triage === 'orange' ? 'bg-orange-400' : 'bg-green-400'}`} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.consultation_status] || STATUS_COLORS.registered}`}>
                        {p.consultation_status?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  {p.last_symptoms && <p className="text-sm text-gray-500 mt-2">{p.last_symptoms}</p>}
                </div>

                {isExpanded && (
                  <div className="border-t p-5 bg-gray-50 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">{t('doctor_dashboard.add_notes')}</label>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-field mt-1" rows={3} placeholder="Clinical notes, observations..." />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => updatePatient(pid, { consultation_status: 'in_progress' })} className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-xl text-sm font-medium">
                        <FiEdit /> Start Consultation
                      </button>
                      <button onClick={() => { updatePatient(pid, { consultation_status: 'completed', doctor_notes: notes }); setNotes(''); }} className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-medium">
                        <FiCheck /> Mark Complete
                      </button>
                      <button onClick={() => updatePatient(pid, { referral_needed: true })} className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-xl text-sm font-medium">
                        <FiSend /> Refer
                      </button>
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
