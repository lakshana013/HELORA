import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMenu, FiX, FiHome, FiLogOut, FiSettings, FiRefreshCw } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import ConnectionStatus from './ConnectionStatus.jsx';
import OfflineBanner from './OfflineBanner.jsx';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDoctor = user?.role === 'doctor';
  const profilePath = isDoctor ? '/doctor/profile' : '/patient/profile';
  const homePath = isDoctor ? '/doctor' : '/patient';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100" role="navigation">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={homePath} className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">+</span>
            </div>
            <span className="text-lg font-bold text-green-700">Healora</span>
            {isDoctor && (
              <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                {t('common.doctor')}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-3">
            <ConnectionStatus />

            <Link to="/sync" className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Sync Status">
              <FiRefreshCw className="w-4 h-4 text-gray-500" />
            </Link>

            <Link to={profilePath} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiUser className="w-5 h-5 text-gray-600" />
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <FiX className="w-5 h-5 text-gray-600" /> : <FiMenu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top">
            <div className="max-w-5xl mx-auto px-4 py-3 space-y-1">
              <Link to={homePath} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                <FiHome className="w-5 h-5" />
                {t('common.home')}
              </Link>
              <Link to={profilePath} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                <FiUser className="w-5 h-5" />
                {t('common.profile')}
              </Link>
              <Link to="/sync" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                <FiRefreshCw className="w-5 h-5" />
                {t('offline.sync_status') || 'Sync Status'}
              </Link>
              <Link to="/dev" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                <FiSettings className="w-5 h-5" />
                {t('offline.dev_mode') || 'Developer Mode'}
              </Link>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <FiLogOut className="w-5 h-5" />
                {t('common.logout')}
              </button>
            </div>
          </div>
        )}
      </nav>
      <OfflineBanner />
    </>
  );
};

export default Navbar;
