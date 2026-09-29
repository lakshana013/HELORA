import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiActivity, FiCheck, FiSend, FiAlertCircle, FiChevronDown, FiX } from 'react-icons/fi';
import api from '../../utils/api.js';

const MOCK_SESSIONS = [
  { id: 's1', patient_name: 'Lakshmi Devi', age: 35, gender: 'female', symptoms_text: 'Fever and body pain for 3 days', triage_level: 'orange', ai_summary: 'Patient reports persistent fever with body aches. Moderate severity.', timestamp: '2024-09-22T10:30:00', doctor_review_status: 'pending' },
  { id: 's2', patient_name: 'Ravi Kumar', age: 52, gender: 'male', symptoms_text: 'Chest pain when walking', triage_level: 'red', ai_summary: 'Patient experiencing chest pain with exertion. Possible cardiac involvement. Urgent evaluation recommended.', timestamp: '2024-09-22T09:15:00', doctor_review_status: 'pending' },
  { id: 's3', patient_name: 'Meena S.', age: 28, gender: 'female', symptoms_text: 'Headache and nausea', triage_level: 'green', ai_summary: 'Mild headache with nausea. No alarming features.', timestamp: '2024-09-21T16:45:00', doctor_review_status: 'pending' },
  { id: 's4', patient_name: 'Venkat R.', age: 67, gender: 'male', symptoms_text: 'Blood sugar very high, feeling dizzy', triage_level: 'orange', ai_summary: 'Elderly diabetic with hyperglycemia and dizziness. Needs medication review.', timestamp: '2024-09-21T14:20:00', doctor_review_status: 'pending' },
];

export default function AITriageReview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [filter, setFilter] = useState('pending');
  const [reviewId, setReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ notes: '', observations: '', triage_override: '', referral: '' });

  useEffect(() => {
    api.get(`/api/doctors/triage-sessions?status=${filter === 'all' ? 'all' : filter}`).then(r => {
      if (r.data?.length) setSessions(r.data);
    }).catch(() => {});
  }, [filter]);

  const pendingCount = sessions.filter(s => s.doctor_review_status === 'pending').length;
  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.doctor_review_status === filter);

  const submitReview = async (sessionId) => {
    try {
      await api.post(`/api/doctors/triage-sessions/${sessionId}/review`, reviewForm);
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, doctor_review_status: reviewForm.referral ? 'referred' : 'reviewed' } : s));
      setReviewId(null);
      setReviewForm({ notes: '', observations: '', triage_override: '', referral: '' });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/doctor')} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"><FiArrowLeft className="text-xl" /></button>
        <h1 className="text-xl font-bold text-gray-900">{t('doctor_dashboard.ai_triage')}</h1>
        {pendingCount > 0 && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">{pendingCount} pending</span>}
      </div>

      <div className="px-6 pt-4 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4">
          {['pending', 'reviewed', 'all'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === s ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map(session => (
            <div key={session.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{session.patient_name}</p>
                      <span className="text-sm text-gray-500">{session.age}y, {session.gender}</span>
                    </div>
                    <p className="text-gray-700 mt-2">{session.symptoms_text}</p>
                    <p className="text-sm text-gray-500 mt-2">{session.ai_summary}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(session.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`w-4 h-4 rounded-full ${session.triage_level === 'red' ? 'bg-red-500' : session.triage_level === 'orange' ? 'bg-orange-400' : 'bg-green-400'}`} />
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${session.doctor_review_status === 'reviewed' ? 'bg-green-100 text-green-700' : session.doctor_review_status === 'referred' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {session.doctor_review_status}
                    </span>
                  </div>
                </div>
                {session.doctor_review_status === 'pending' && (
                  <button onClick={() => setReviewId(session.id)} className="mt-3 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700">
                    {t('doctor_dashboard.review_session')}
                  </button>
                )}
              </div>

              {reviewId === session.id && (
                <div className="border-t p-5 bg-green-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Your Review</h3>
                    <button onClick={() => setReviewId(null)}><FiX className="text-gray-400" /></button>
                  </div>
                  <textarea value={reviewForm.notes} onChange={e => setReviewForm({...reviewForm, notes: e.target.value})} placeholder="Your clinical notes..." className="input-field" rows={3} />
                  <textarea value={reviewForm.observations} onChange={e => setReviewForm({...reviewForm, observations: e.target.value})} placeholder="Observations..." className="input-field" rows={2} />
                  <select value={reviewForm.triage_override} onChange={e => setReviewForm({...reviewForm, triage_override: e.target.value})} className="input-field">
                    <option value="">Agree with AI triage level</option>
                    <option value="green">Override: Green (low)</option>
                    <option value="orange">Override: Orange (moderate)</option>
                    <option value="red">Override: Red (urgent)</option>
                  </select>
                  <input type="text" value={reviewForm.referral} onChange={e => setReviewForm({...reviewForm, referral: e.target.value})} placeholder="Referral (leave empty if none)" className="input-field" />
                  <div className="flex gap-2">
                    <button onClick={() => submitReview(session.id)} className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
                      <FiCheck /> {t('doctor_dashboard.mark_reviewed')}
                    </button>
                    {reviewForm.referral && (
                      <button onClick={() => submitReview(session.id)} className="flex items-center gap-1 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
                        <FiSend /> {t('doctor_dashboard.refer_patient')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
