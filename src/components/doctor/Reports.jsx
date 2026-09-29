import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiBarChart2, FiUsers, FiCalendar, FiSend, FiMap, FiDownload } from 'react-icons/fi';

const MONTHLY_DATA = [
  { month: 'Apr', patients: 45 }, { month: 'May', patients: 62 }, { month: 'Jun', patients: 58 },
  { month: 'Jul', patients: 71 }, { month: 'Aug', patients: 89 }, { month: 'Sep', patients: 78 },
];

const TRIAGE_DIST = { green: 45, orange: 28, red: 5 };

const CAMP_SUMMARY = [
  { name: 'General Health Camp', date: '2024-09-01', village: 'Semmancheri', patients: 31, completed: 28 },
  { name: 'Diabetes Screening', date: '2024-08-15', village: 'Thiruvalluvar Nagar', patients: 24, completed: 24 },
  { name: 'Eye & Dental Camp', date: '2024-07-20', village: 'Kannapuram', patients: 18, completed: 16 },
];

function Bar({ value, max, color, label }) {
  const width = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 w-10">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
        <div className={`h-full rounded-full ${color} flex items-center pl-2`} style={{ width: `${width}%` }}>
          <span className="text-xs text-white font-medium">{value}</span>
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const maxPatients = Math.max(...MONTHLY_DATA.map(d => d.patients));
  const totalTriage = TRIAGE_DIST.green + TRIAGE_DIST.orange + TRIAGE_DIST.red;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/doctor')} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"><FiArrowLeft className="text-xl" /></button>
        <h1 className="text-xl font-bold text-gray-900">{t('doctor_dashboard.reports')}</h1>
      </div>

      <div className="px-6 pt-6 max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { icon: FiUsers, label: 'Patients this month', value: 78, color: 'bg-blue-50 text-blue-600' },
            { icon: FiBarChart2, label: 'Avg triage', value: 'Green', color: 'bg-green-50 text-green-600' },
            { icon: FiCalendar, label: 'Camps conducted', value: 3, color: 'bg-purple-50 text-purple-600' },
            { icon: FiSend, label: 'Referrals made', value: 7, color: 'bg-orange-50 text-orange-600' },
            { icon: FiMap, label: 'Areas covered', value: 5, color: 'bg-teal-50 text-teal-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
              <stat.icon className={`text-xl mb-2 ${stat.color.split(' ')[1]}`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Patient Count</h3>
          <div className="space-y-3">
            {MONTHLY_DATA.map(d => (
              <Bar key={d.month} label={d.month} value={d.patients} max={maxPatients} color="bg-green-500" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Triage Level Distribution</h3>
          <div className="space-y-3">
            <Bar label="Low" value={TRIAGE_DIST.green} max={totalTriage} color="bg-green-500" />
            <Bar label="Med" value={TRIAGE_DIST.orange} max={totalTriage} color="bg-orange-400" />
            <Bar label="High" value={TRIAGE_DIST.red} max={totalTriage} color="bg-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Camp Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4">Camp</th>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Village</th>
                  <th className="pb-2 pr-4">Patients</th>
                  <th className="pb-2">Completed</th>
                </tr>
              </thead>
              <tbody>
                {CAMP_SUMMARY.map((c, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-900">{c.name}</td>
                    <td className="py-3 pr-4 text-gray-500">{c.date}</td>
                    <td className="py-3 pr-4 text-gray-500">{c.village}</td>
                    <td className="py-3 pr-4">{c.patients}</td>
                    <td className="py-3">{c.completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl p-4 text-gray-600 font-medium hover:bg-gray-50">
          <FiDownload /> Download Report (Coming Soon)
        </button>
      </div>
    </div>
  );
}
