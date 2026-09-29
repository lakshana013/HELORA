import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiMap, FiCalendar, FiUsers, FiActivity, FiSend, FiBarChart2, FiUser, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.jsx';
import api from '../../utils/api.js';

const NAV_ITEMS = [
  { icon: FiHome, labelKey: 'doctor_dashboard.overview', path: '/doctor' },
  { icon: FiMap, labelKey: 'doctor_dashboard.rural_areas', path: '/doctor/rural-areas' },
  { icon: FiCalendar, labelKey: 'doctor_dashboard.health_camps', path: '/doctor/camps' },
  { icon: FiActivity, labelKey: 'doctor_dashboard.ai_triage', path: '/doctor/triage' },
  { icon: FiUser, labelKey: 'doctor_dashboard.profile', path: '/doctor/profile' },
];

export default function DoctorDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalPatients: 156, pendingReviews: 12, activeCamps: 3, areasCovered: 8 });
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    api.get('/api/doctors/stats').then(r => r.data && setStats(r.data)).catch(() => {});
    api.get('/api/doctors/triage-sessions?status=pending').then(r => r.data && setRecentSessions(r.data.slice(0, 4))).catch(() => {});
  }, []);

  const STATS = [
    { label: t('doctor_dashboard.total_patients'), value: stats.totalPatients, icon: FiUsers, color: 'bg-blue-50 text-blue-600' },
    { label: t('doctor_dashboard.pending_reviews'), value: stats.pendingReviews, icon: FiAlertCircle, color: 'bg-orange-50 text-orange-600' },
    { label: t('doctor_dashboard.active_camps'), value: stats.activeCamps, icon: FiCalendar, color: 'bg-green-50 text-green-600' },
    { label: t('doctor_dashboard.areas_covered'), value: stats.areasCovered, icon: FiMap, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold text-green-700">{t('doctor_dashboard.title')}</h1>
      </div>

      <div className="px-6 pt-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome, {user?.name || 'Doctor'}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="text-lg" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{t('doctor_dashboard.ai_triage')}</h3>
              <Link to="/doctor/triage" className="text-green-600 text-sm font-medium">View all →</Link>
            </div>
            {recentSessions.length > 0 ? recentSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{s.patient_name || 'Patient'}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{s.symptoms_text || 'Symptoms reported'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${s.triage_level === 'red' ? 'bg-red-500' : s.triage_level === 'orange' ? 'bg-orange-400' : 'bg-green-400'}`} />
                  <button onClick={() => navigate('/doctor/triage')} className="p-1 text-gray-400 hover:text-green-600">
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-center py-6">No pending reviews</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{t('doctor_dashboard.health_camps')}</h3>
              <Link to="/doctor/camps" className="text-green-600 text-sm font-medium">View all →</Link>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Free Health Check-up Camp', village: 'Thiruvalluvar Nagar', date: '2024-10-15', patients: 24 },
                { name: 'Eye & Dental Camp', village: 'Perumbakkam Colony', date: '2024-10-20', patients: 18 },
                { name: 'Diabetes Screening', village: 'Semmancheri Village', date: '2024-10-28', patients: 31 },
              ].map((camp, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{camp.name}</p>
                    <p className="text-sm text-gray-500">{camp.village} · {camp.date}</p>
                  </div>
                  <span className="text-sm text-green-600 font-medium">{camp.patients} patients</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: FiMap, label: t('doctor_dashboard.rural_areas'), path: '/doctor/rural-areas', color: 'bg-teal-50 text-teal-600' },
            { icon: FiUsers, label: t('doctor_dashboard.patients'), path: '/doctor/patients', color: 'bg-blue-50 text-blue-600' },
            { icon: FiSend, label: t('doctor_dashboard.referrals'), path: '/doctor/referrals', color: 'bg-purple-50 text-purple-600' },
            { icon: FiBarChart2, label: t('doctor_dashboard.reports'), path: '/doctor/reports', color: 'bg-orange-50 text-orange-600' },
          ].map((item) => (
            <Link key={item.path} to={item.path} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
              <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.color}`}><item.icon /></span>
              <span className="text-sm font-medium text-gray-700 text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
        <div className="max-w-4xl mx-auto flex justify-around">
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 px-2 py-1 text-gray-400 hover:text-green-600 transition-colors">
              <item.icon className="text-xl" />
              <span className="text-xs">{t(item.labelKey)}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
