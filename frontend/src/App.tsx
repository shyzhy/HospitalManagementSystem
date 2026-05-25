import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

// @ts-ignore: allow importing CSS without type declarations
import './App.css';

// Views
import ConsultationsView from './views/ConsultationsView';
import TreatmentView from './views/TreatmentView';
import MedicalRecordsView from './views/MedicalRecordsView';
import PatientsView from './views/PatientsView';
import DoctorsView from './views/DoctorsView';
import PrescriptionsView from './views/PrescriptionsView';
import AccountView from './views/AccountView';

// Components
import Login from './component/Login';
import Activate from './component/Activate';
import Sidebar from './component/Sidebar';
import PrivateRoute from './router/PrivateRoute';
import Chatbot from './component/Chatbot';

// API & Types
import { getPatients, getDoctors } from './api';
import { Patient, Doctor } from './types';

function ActivateRoute() {
  const { uid, token } = useParams();

  if (!uid || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Activate uid={uid} token={token} />;
}

function AppContent() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('role') || 'patient');
  const userName = localStorage.getItem('userName') || 'User';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultedPatients, setConsultedPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      if (userRole === 'admin' || userRole === 'doctor' || userRole === 'patient') {
        try {
          const pData = await getPatients();
          setPatients(pData);

          if (userRole === 'doctor') {
            const cpData = await getPatients(true);
            setConsultedPatients(cpData);
          }
        } catch (e) {
          console.error('Patient Fetch Error:', e);
        }

        if (userRole !== 'patient') {
          try {
            const dData = await getDoctors();
            setDoctors(dData);
          } catch (e) {
            console.error('Doctor Fetch Error:', e);
          }
        }
      }
    };

    fetchData();
  }, [token, userRole, refreshKey]);

  const handleLoginSuccess = (t: string, r: string) => {
    setToken(t);
    setUserRole(r);

    localStorage.setItem('token', t);
    localStorage.setItem('role', r);

    if (r === 'admin') navigate('/patients');
    if (r === 'doctor' || r === 'patient') navigate('/consultations');
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    window.location.href = '/login';
  };

  const canRegisterNew = () => {
    const path = location.pathname;

    if (path === '/account') return false;
    if (userRole === 'admin') return true;

    if (userRole === 'doctor') {
      if (path === '/patients') return false;
      return true;
    }

    if (userRole === 'patient') return path === '/consultations';

    return false;
  };

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  if (location.pathname === '/login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (!token && !location.pathname.startsWith('/activate')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/activate/:uid/:token" element={<ActivateRoute />} />

      <Route
        path="/*"
        element={
          <div className="h-screen flex flex-col overflow-hidden bg-[#F0F2F5] font-sans">
            <header className="h-14 bg-[#3b5998] text-white flex items-center justify-between px-3 sm:px-5 shrink-0 shadow-sm z-30">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 mr-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                <h1 className="text-sm font-black tracking-wide uppercase">MedFlow</h1>
              </div>

              <div className="flex items-center gap-3 sm:gap-6">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold leading-tight">
                    {userRole === 'doctor' && !userName.startsWith('Dr.') ? `Dr. ${userName}` : userName}
                  </span>
                  <span className="text-[9px] text-white/70 capitalize">{userRole}</span>
                </div>

                <div
                  className={`w-8 h-8 rounded-full bg-[#2A3F6D] border border-white/20 flex items-center justify-center font-bold text-xs overflow-hidden ${
                    userRole === 'doctor' || userRole === 'patient'
                      ? 'cursor-pointer hover:bg-white/20 transition-colors'
                      : ''
                  }`}
                  onClick={() => navigate('/account')}
                  title={userRole !== 'admin' ? 'Account Settings' : 'Profile'}
                >
                  {(() => {
                    let picUrl: string | undefined;

                    if (userRole === 'doctor') {
                      const doc = doctors.find(
                        (d) => d.id === parseInt(localStorage.getItem('doctorId') || '0')
                      );
                      picUrl = doc?.profile_picture_url;
                    } else if (userRole === 'patient') {
                      const pat = patients.find(
                        (p) => p.id === parseInt(localStorage.getItem('patientId') || '0')
                      );
                      picUrl = pat?.profile_picture_url;
                    }

                    if (picUrl) {
                      return <img src={picUrl} alt="avatar" className="w-full h-full object-cover" />;
                    }

                    return userName.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();
                  })()}
                </div>

                <div className="w-px h-5 bg-white/20"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors"
                  title="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">LOGOUT</span>
                </button>
              </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 relative">
                <div className="bg-transparent min-h-[60vh]">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Navigate
                          to={userRole === 'admin' ? '/patients' : '/consultations'}
                          replace
                        />
                      }
                    />

                    <Route
                      path="/consultations"
                      element={
                        <PrivateRoute isAuthenticated={!!token}>
                          <ConsultationsView
                            patients={patients}
                            canRegisterNew={canRegisterNew()}
                          />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/treatment"
                      element={
                        <PrivateRoute isAuthenticated={!!token}>
                          {userRole !== 'patient' ? (
                            <TreatmentView
                              patients={patients}
                              doctors={doctors}
                              canRegisterNew={canRegisterNew()}
                            />
                          ) : (
                            <Navigate to="/" />
                          )}
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/medical-records"
                      element={
                        <PrivateRoute isAuthenticated={!!token}>
                          {userRole !== 'patient' ? (
                            <MedicalRecordsView
                              patients={patients}
                              canRegisterNew={canRegisterNew()}
                            />
                          ) : (
                            <Navigate to="/" />
                          )}
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/patients"
                      element={
                        <PrivateRoute isAuthenticated={!!token}>
                          {userRole !== 'patient' ? (
                            <PatientsView
                              patients={userRole === 'doctor' ? consultedPatients : patients}
                              doctors={doctors}
                              userRole={userRole}
                              canRegisterNew={canRegisterNew()}
                              onRefresh={handleRefresh}
                            />
                          ) : (
                            <Navigate to="/" />
                          )}
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/doctors"
                      element={
                        <PrivateRoute isAuthenticated={!!token}>
                          {userRole === 'admin' ? (
                            <DoctorsView doctors={doctors} onRefresh={handleRefresh} />
                          ) : (
                            <Navigate to="/" />
                          )}
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/prescriptions"
                      element={
                        <PrivateRoute isAuthenticated={!!token}>
                          <PrescriptionsView
                            patients={patients}
                            doctors={doctors}
                            canRegisterNew={canRegisterNew()}
                          />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/account"
                      element={
                        <PrivateRoute isAuthenticated={!!token}>
                          <AccountView
                            userRole={userRole}
                            patients={patients}
                            doctors={doctors}
                            onRefresh={handleRefresh}
                          />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </div>
              </main>

              <Chatbot />
            </div>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;