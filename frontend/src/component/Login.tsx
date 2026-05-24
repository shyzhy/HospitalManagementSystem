import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = "https://hospitalmanagementsystem-production-7cbf.up.railway.app";

interface LoginProps {
    onLoginSuccess: (token: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);

    // Login state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Register state
    const [regData, setRegData] = useState({
        email: '', password: '', re_password: '',
        first_name: '', last_name: '',
        dob: '', gender: 'M', phone: '', address: ''
    });
    const [regLoading, setRegLoading] = useState(false);
    const [regSuccess, setRegSuccess] = useState('');
    const [regError, setRegError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLoginError('');
        try {
           const tokenRes = await axios.post(`${BACKEND_URL}/auth/token/login/`, {username: email, password});
            const token = tokenRes.data.auth_token;

            const userRes = await axios.get(`${BACKEND_URL}/auth/users/me/`, {
                headers: { Authorization: `Token ${token}` }
            });
            
            const userData = userRes.data;
            let role = userData.is_staff ? 'admin' : (userData.is_doctor ? 'doctor' : 'patient');

            const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            const displayName = userData.profile_name || fullName || userData.email || 'User';
            localStorage.setItem('userName', displayName);

            if (userData.patient_id) {
                localStorage.setItem('patientId', String(userData.patient_id));
            } else {
                localStorage.removeItem('patientId');
            }

            if (userData.doctor_id) {
                localStorage.setItem('doctorId', String(userData.doctor_id));
            } else {
                localStorage.removeItem('doctorId');
            }

            onLoginSuccess(token, role);
        } catch (err) {
            setLoginError("Login Failed: Please check your credentials or ensure your account has been activated.");
        } finally { 
            setLoading(false); 
        }
    };

    const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setRegData({ ...regData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegLoading(true);
        setRegError('');
        setRegSuccess('');
        try {
            await axios.post(`${BACKEND_URL}/api/v1/register/`, regData);
            setRegSuccess('Account created! Please check your email to activate your account before signing in.');
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Registration failed. Please try again.';
            setRegError(msg);
        } finally {
            setRegLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] text-sm text-slate-800 placeholder:text-slate-400 transition-all";
    const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1 mb-1.5 block";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] p-4 font-sans relative overflow-hidden">
            
            <div className={`bg-white w-full ${isRegister ? 'max-w-[540px]' : 'max-w-[420px]'} p-10 rounded-2xl shadow-xl border border-slate-200 relative z-10 transition-all duration-500`}>
                
                {/* Header Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-[#556ee6]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mt-5">MedFlow</h2>
                    <p className="text-[#556ee6] text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">Hospital Management System</p>
                </div>

                {/* Tab Toggle */}
                <div className="flex bg-slate-100/80 rounded-xl p-1 mb-8 border border-slate-200/60 shadow-inner">
                    <button
                        type="button"
                        onClick={() => { setIsRegister(false); setRegError(''); setRegSuccess(''); }}
                        className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.1em] transition-all ${!isRegister ? 'bg-white text-[#556ee6] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsRegister(true); setRegError(''); setRegSuccess(''); }}
                        className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.1em] transition-all ${isRegister ? 'bg-white text-[#556ee6] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Create Account
                    </button>
                </div>

                {/* ===== LOGIN FORM ===== */}
                {!isRegister && (
                    <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in duration-300">
                        {loginError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold text-center animate-in fade-in zoom-in-95 duration-300">
                                ✕ {loginError}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Email Address</label>
                                <input 
                                    className={inputClass}
                                    placeholder="your@email.com" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Password</label>
                                <input 
                                    type="password" 
                                    className={inputClass}
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#556ee6] hover:bg-[#485ec4] text-white rounded-xl py-3.5 px-6 font-bold text-[12px] uppercase tracking-widest transition-all shadow-md shadow-[#556ee6]/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center">
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Authenticating...</span>
                                </div>
                            ) : 'Sign In'}
                        </button>
                        
                        <div className="text-center pt-2">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Secure Access Gateway</p>
                        </div>
                    </form>
                )}

                {/* ===== REGISTER FORM ===== */}
                {isRegister && (
                    <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in duration-300">
                        {/* Status Messages */}
                        {regSuccess && (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold text-center animate-in fade-in zoom-in-95 duration-300">
                                ✓ {regSuccess}
                            </div>
                        )}
                        {regError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold text-center animate-in fade-in zoom-in-95 duration-300">
                                ✕ {regError}
                            </div>
                        )}

                        {/* Account Credentials */}
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <input name="email" value={regData.email} onChange={handleRegChange} required className={inputClass} placeholder="your@email.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Password</label>
                                <input type="password" name="password" value={regData.password} onChange={handleRegChange} required className={inputClass} placeholder="••••••••" />
                            </div>
                            <div>
                                <label className={labelClass}>Confirm Password</label>
                                <input type="password" name="re_password" value={regData.re_password} onChange={handleRegChange} required className={inputClass} placeholder="••••••••" />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 py-2">
                            <div className="flex-1 h-px bg-slate-100"></div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patient Details</span>
                            <div className="flex-1 h-px bg-slate-100"></div>
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>First Name</label>
                                <input name="first_name" value={regData.first_name} onChange={handleRegChange} required className={inputClass} placeholder="Juan" />
                            </div>
                            <div>
                                <label className={labelClass}>Last Name</label>
                                <input name="last_name" value={regData.last_name} onChange={handleRegChange} required className={inputClass} placeholder="Dela Cruz" />
                            </div>
                        </div>

                        {/* DOB + Gender */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Date of Birth</label>
                                <input type="date" name="dob" value={regData.dob} onChange={handleRegChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Gender</label>
                                <select name="gender" value={regData.gender} onChange={handleRegChange} required className={`${inputClass} cursor-pointer`}>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Phone + Address */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Phone Number</label>
                                <input name="phone" value={regData.phone} onChange={handleRegChange} className={inputClass} placeholder="09XX XXX XXXX" />
                            </div>
                            <div>
                                <label className={labelClass}>Address</label>
                                <input name="address" value={regData.address} onChange={handleRegChange} className={inputClass} placeholder="City, Province" />
                            </div>
                        </div>

                        <button type="submit" disabled={regLoading} className="w-full mt-2 bg-[#556ee6] hover:bg-[#485ec4] text-white rounded-xl py-3.5 px-6 font-bold text-[12px] uppercase tracking-widest transition-all shadow-md shadow-[#556ee6]/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center">
                            {regLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : 'Create Patient Account'}
                        </button>
                        
                        <div className="text-center pt-2">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Patient Self-Registration Portal</p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;