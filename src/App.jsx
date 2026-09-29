import { Suspense, lazy, Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { ConnectionProvider } from './contexts/ConnectionContext.jsx';
import { SyncProvider } from './contexts/SyncContext.jsx';

const LandingPage = lazy(() => import('./components/landing/LandingPage.jsx'));
const LoginPage = lazy(() => import('./components/auth/LoginPage.jsx'));
const SignupPage = lazy(() => import('./components/auth/SignupPage.jsx'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword.jsx'));

const PatientDashboard = lazy(() => import('./components/patient/PatientDashboard.jsx'));
const SymptomInput = lazy(() => import('./components/patient/SymptomInput.jsx'));
const TriageChat = lazy(() => import('./components/patient/TriageChat.jsx'));
const TriageResult = lazy(() => import('./components/patient/TriageResult.jsx'));
const EmergencyScreen = lazy(() => import('./components/patient/EmergencyScreen.jsx'));
const NearbyFacilities = lazy(() => import('./components/patient/NearbyFacilities.jsx'));
const HealthCamps = lazy(() => import('./components/patient/HealthCamps.jsx'));
const HealthHistory = lazy(() => import('./components/patient/HealthHistory.jsx'));
const MedicineDirectory = lazy(() => import('./components/patient/MedicineDirectory.jsx'));
const AyurvedaDirectory = lazy(() => import('./components/patient/AyurvedaDirectory.jsx'));
const PatientProfile = lazy(() => import('./components/patient/PatientProfile.jsx'));

const DoctorDashboard = lazy(() => import('./components/doctor/DoctorDashboard.jsx'));
const RuralAreas = lazy(() => import('./components/doctor/RuralAreas.jsx'));
const HealthCampManager = lazy(() => import('./components/doctor/HealthCampManager.jsx'));
const CampPatients = lazy(() => import('./components/doctor/CampPatients.jsx'));
const PatientReview = lazy(() => import('./components/doctor/PatientReview.jsx'));
const AITriageReview = lazy(() => import('./components/doctor/AITriageReview.jsx'));
const Referrals = lazy(() => import('./components/doctor/Referrals.jsx'));
const Reports = lazy(() => import('./components/doctor/Reports.jsx'));
const DoctorProfile = lazy(() => import('./components/doctor/DoctorProfile.jsx'));

const SyncStatusPage = lazy(() => import('./components/common/SyncStatusPage.jsx'));
const DevModePanel = lazy(() => import('./components/common/DevModePanel.jsx'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-6">We are sorry for the inconvenience. Please try again.</p>
            <button
              className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ConnectionProvider>
              <SyncProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    <Route path="/patient" element={<ProtectedRoute allowedRole="patient"><PatientDashboard /></ProtectedRoute>} />
                    <Route path="/patient/symptom-input" element={<ProtectedRoute allowedRole="patient"><SymptomInput /></ProtectedRoute>} />
                    <Route path="/patient/chat/:sessionId" element={<ProtectedRoute allowedRole="patient"><TriageChat /></ProtectedRoute>} />
                    <Route path="/patient/result/:sessionId" element={<ProtectedRoute allowedRole="patient"><TriageResult /></ProtectedRoute>} />
                    <Route path="/patient/emergency" element={<ProtectedRoute allowedRole="patient"><EmergencyScreen /></ProtectedRoute>} />
                    <Route path="/patient/facilities" element={<ProtectedRoute allowedRole="patient"><NearbyFacilities /></ProtectedRoute>} />
                    <Route path="/patient/camps" element={<ProtectedRoute allowedRole="patient"><HealthCamps /></ProtectedRoute>} />
                    <Route path="/patient/history" element={<ProtectedRoute allowedRole="patient"><HealthHistory /></ProtectedRoute>} />
                    <Route path="/patient/medicines" element={<ProtectedRoute allowedRole="patient"><MedicineDirectory /></ProtectedRoute>} />
                    <Route path="/patient/ayurveda" element={<ProtectedRoute allowedRole="patient"><AyurvedaDirectory /></ProtectedRoute>} />
                    <Route path="/patient/profile" element={<ProtectedRoute allowedRole="patient"><PatientProfile /></ProtectedRoute>} />

                    <Route path="/doctor" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
                    <Route path="/doctor/rural-areas" element={<ProtectedRoute allowedRole="doctor"><RuralAreas /></ProtectedRoute>} />
                    <Route path="/doctor/camps" element={<ProtectedRoute allowedRole="doctor"><HealthCampManager /></ProtectedRoute>} />
                    <Route path="/doctor/camps/:id" element={<ProtectedRoute allowedRole="doctor"><CampPatients /></ProtectedRoute>} />
                    <Route path="/doctor/patients" element={<ProtectedRoute allowedRole="doctor"><PatientReview /></ProtectedRoute>} />
                    <Route path="/doctor/triage" element={<ProtectedRoute allowedRole="doctor"><AITriageReview /></ProtectedRoute>} />
                    <Route path="/doctor/referrals" element={<ProtectedRoute allowedRole="doctor"><Referrals /></ProtectedRoute>} />
                    <Route path="/doctor/reports" element={<ProtectedRoute allowedRole="doctor"><Reports /></ProtectedRoute>} />
                    <Route path="/doctor/profile" element={<ProtectedRoute allowedRole="doctor"><DoctorProfile /></ProtectedRoute>} />

                    <Route path="/sync" element={<SyncStatusPage />} />
                    <Route path="/dev" element={<DevModePanel />} />

                    <Route path="*" element={<LandingPage />} />
                  </Routes>
                </Suspense>
              </SyncProvider>
            </ConnectionProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
