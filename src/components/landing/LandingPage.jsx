import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiInfo, FiGrid, FiHelpCircle, FiMic, FiCpu, FiClipboard, FiMapPin, FiArrowRight, FiAlertTriangle, FiShield, FiWifi, FiGlobe, FiUsers, FiUser, FiUserPlus } from 'react-icons/fi';
import LanguageSelector from '../common/LanguageSelector.jsx';

const NAV_ITEMS = [
  { icon: FiHome, labelKey: 'landing.nav_home', href: '#hero' },
  { icon: FiInfo, labelKey: 'landing.nav_about', href: '#about' },
  { icon: FiGrid, labelKey: 'landing.nav_features', href: '#features' },
  { icon: FiHelpCircle, labelKey: 'landing.nav_help', href: '#help' },
];

const STEPS = [
  { icon: FiMic, titleKey: 'landing.step1_title', descKey: 'landing.step1_desc', color: 'bg-green-50 text-green-600', iconBg: 'bg-green-100' },
  { icon: FiCpu, titleKey: 'landing.step2_title', descKey: 'landing.step2_desc', color: 'bg-teal-50 text-teal-600', iconBg: 'bg-teal-100' },
  { icon: FiClipboard, titleKey: 'landing.step3_title', descKey: 'landing.step3_desc', color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
  { icon: FiMapPin, titleKey: 'landing.step4_title', descKey: 'landing.step4_desc', color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollTo = (id) => {
    const el = document.getElementById(id.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">+</span>
            </div>
            <div className="leading-tight">
              <span className="text-xl font-bold text-green-700">Healora</span>
              <p className="text-[10px] text-gray-400 -mt-0.5 hidden sm:block">Simple healthcare for everyone</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {t(item.labelKey)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector compact />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-30">
          <svg viewBox="0 0 200 200" className="w-full h-full text-green-300">
            <ellipse cx="40" cy="180" rx="100" ry="80" fill="currentColor" />
            <path d="M20,160 Q40,120 30,80 Q50,100 60,70 Q70,110 90,90 Q80,130 100,150 Q60,140 20,160Z" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full text-green-300">
            <circle cx="160" cy="40" r="60" fill="currentColor" />
            <path d="M130,30 Q150,10 170,20 Q160,40 180,50 Q160,60 170,80 Q150,70 130,80 Q140,60 130,30Z" fill="currentColor" opacity="0.5" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-green-100 mb-6">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <span className="text-sm font-semibold text-green-700">AI Powered</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm font-semibold text-green-700">Works Online & Offline</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-3">
                Healora
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
                {t('landing.hero_title')}
              </h2>
              <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
                {t('landing.hero_subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/login?role=patient')}
                  className="group flex items-center justify-center gap-3 bg-green-600 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  <FiUser className="w-5 h-5" />
                  {t('landing.im_patient')}
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login?role=doctor')}
                  className="group flex items-center justify-center gap-3 bg-white text-green-700 font-semibold text-lg px-8 py-4 rounded-2xl border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all active:scale-[0.98]"
                >
                  <FiUserPlus className="w-5 h-5" />
                  {t('landing.im_doctor')}
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Illustration area */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Central circle */}
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mx-auto flex items-center justify-center mb-2">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">+</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-green-800">Healora AI</p>
                  </div>

                  {/* Orbiting elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
                    <FiCpu className="w-8 h-8 text-teal-500" />
                  </div>
                  <div className="absolute -bottom-2 -left-6 w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                    <FiMic className="w-7 h-7 text-green-500" />
                  </div>
                  <div className="absolute top-6 -left-10 w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                    <FiMapPin className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="absolute -bottom-6 right-2 w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
                    <FiClipboard className="w-7 h-7 text-purple-500" />
                  </div>
                </div>

                {/* Decorative dots */}
                <div className="absolute top-0 left-0 w-3 h-3 bg-green-300 rounded-full" />
                <div className="absolute bottom-10 right-0 w-2 h-2 bg-teal-400 rounded-full" />
                <div className="absolute top-20 right-4 w-2 h-2 bg-green-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t('landing.how_it_works')}</h2>
            <p className="text-gray-500 text-lg">{t('landing.steps_subtitle') || 'Simple steps to better health'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="relative group">
                <div className={`${step.color} rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow h-full`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 bg-green-600 text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className={`w-12 h-12 ${step.iconBg} rounded-xl flex items-center justify-center`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t(step.titleKey)}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t(step.descKey)}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <FiArrowRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiShield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{t('landing.feature_safe') || 'Safe & Secure'}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiWifi className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{t('landing.feature_offline') || 'Works Offline'}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiGlobe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{t('landing.feature_languages') || 'Available in 3 Languages'}</h3>
              <div className="flex justify-center gap-1 mt-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">English</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">हिंदी</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">தமிழ்</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiUsers className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{t('landing.feature_rural') || 'For Rural Communities'}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section id="help" className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-red-700 text-sm leading-relaxed font-medium pt-2">
              {t('landing.emergency_notice')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">+</span>
            </div>
            <span className="text-lg font-bold text-green-700">Healora</span>
          </div>
          <p className="text-gray-400 text-sm">&copy; 2024 Healora - Simple healthcare for everyone</p>
        </div>
      </footer>
    </div>
  );
}
