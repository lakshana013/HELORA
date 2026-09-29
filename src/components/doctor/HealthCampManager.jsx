import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiPlus, FiCalendar, FiMapPin, FiUsers, FiClock, FiX } from 'react-icons/fi';
import api from '../../utils/api.js';

const STATUS_COLORS = { planned: 'bg-blue-100 text-blue-700', ongoing: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-600' };

const SERVICES = ['General check-up', 'Blood pressure', 'Blood sugar', 'Basic consultation', 'Ayurveda consultation', 'Health education', 'Eye check-up', 'Dental check-up', 'Maternal health', 'Vaccination'];

export default function HealthCampManager() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', village_area: '', date: '', time: '', location_address: '', services: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCamps(); }, []);

  const loadCamps = async () => {
    try {
      const res = await api.get('/api/camps');
      setCamps(res.data || []);
    } catch {} finally { setLoading(false); }
  };

  const toggleService = (s) => {
    setForm(f => ({ ...f, services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s] }));
  };

  const createCamp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/camps', form);
      setShowForm(false);
      setForm({ name: '', village_area: '', date: '', time: '', location_address: '', services: [] });
      loadCamps();
    } catch {}
  };

  const filtered = filter === 'all' ? camps : camps.filter(c => c.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/doctor')} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"><FiArrowLeft className="text-xl" /></button>
          <h1 className="text-xl font-bold text-gray-900">{t('doctor_dashboard.health_camps')}</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700">
          <FiPlus /> {t('doctor_dashboard.create_camp')}
        </button>
      </div>

      <div className="px-6 pt-4 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {['all', 'planned', 'ongoing', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${filter === s ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <FiCalendar className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No camps found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(camp => (
              <div key={camp.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{camp.name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1"><FiMapPin /> {camp.village_area}</span>
                      <span className="flex items-center gap-1"><FiCalendar /> {camp.date}</span>
                      {camp.time && <span className="flex items-center gap-1"><FiClock /> {camp.time}</span>}
                      <span className="flex items-center gap-1"><FiUsers /> {camp.registered_count || 0} registered</span>
                    </div>
                    {camp.services && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {camp.services.split(',').map((s, i) => (
                          <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[camp.status] || STATUS_COLORS.planned}`}>
                    {camp.status}
                  </span>
                </div>
                <Link to={`/doctor/camps/${camp.id}`} className="inline-block mt-3 text-green-600 text-sm font-medium hover:underline">
                  View Patients →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{t('doctor_dashboard.create_camp')}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><FiX /></button>
            </div>
            <form onSubmit={createCamp} className="space-y-4">
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t('doctor_dashboard.camp_name')} className="input-field" required />
              <input type="text" value={form.village_area} onChange={e => setForm({...form, village_area: e.target.value})} placeholder={t('doctor_dashboard.village_area')} className="input-field" required />
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field" required />
              <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="input-field" />
              <textarea value={form.location_address} onChange={e => setForm({...form, location_address: e.target.value})} placeholder="Location address" className="input-field" rows={2} />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{t('camps.services')}</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map(s => (
                    <button key={s} type="button" onClick={() => toggleService(s)}
                      className={`px-3 py-1 rounded-full text-sm border ${form.services.includes(s) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">{t('doctor_dashboard.create_camp')}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
