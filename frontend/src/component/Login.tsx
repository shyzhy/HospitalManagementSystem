import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
    onLoginSuccess: (token: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);

    // Login state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
        try {
            const tokenRes = await axios.post('http://127.0.0.1:8000/auth/token/login/', { username: email, password });
            const token = tokenRes.data.auth_token;

            const userRes = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
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
            alert("Login Failed: Check credentials.");
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
            await axios.post('http://127.0.0.1:8000/api/v1/register/', regData);
            setRegSuccess('Account created successfully! You can now sign in.');
            setTimeout(() => {
                setIsRegister(false);
                setEmail(regData.email);
                setRegSuccess('');
            }, 2000);
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Registration failed. Please try again.';
            setRegError(msg);
        } finally {
            setRegLoading(false);
        }
    };

    const inputClass = "w-full p-4 pl-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-0 focus:border-blue-400 font-medium text-white placeholder:text-slate-500 transition-all focus:bg-white/10";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 font-sans relative overflow-hidden">
            {/* Ambient Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-500/20 blur-[100px] mix-blend-screen pointer-events-none"></div>
            
            <div className={`bg-white/5 backdrop-blur-2xl border border-white/10 w-full ${isRegister ? 'max-w-[520px]' : 'max-w-[420px]'} p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative z-10 transition-all duration-500`}>
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <span className="text-4xl text-white">🏥</span>
                    </div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-tighter mt-6">MedFlow</h2>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Hospital Management System</p>
                </div>

                {/* Tab Toggle */}
                <div className="flex bg-white/5 rounded-2xl p-1 mb-8 border border-white/10">
                    <button
                        type="button"
                        onClick={() => { setIsRegister(false); setRegError(''); setRegSuccess(''); }}
                        className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all ${!isRegister ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsRegister(true); setRegError(''); setRegSuccess(''); }}
                        className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all ${isRegister ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Create Account
                    </button>
                </div>

                {/* ===== LOGIN FORM ===== */}
                {!isRegister && (
                    <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in duration-300">
                        <div className="space-y-4">
                            <div className="relative group">
                                <input 
                                    className={inputClass}
                                    placeholder="Email" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity -z-10 blur-md hidden group-focus-within:block"></div>
                            </div>

                            <div className="relative group">
                                <input 
                                    type="password" 
                                    className={inputClass}
                                    placeholder="Password" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="relative w-full group overflow-hidden rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative px-6 py-4 text-white font-black text-sm uppercase tracking-[0.15em] flex justify-center items-center">
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className="opacity-90">Authenticating...</span>
                                    </div>
                                ) : 'Sign In'}
                            </div>
                        </button>
                        
                        <div className="text-center mt-6">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Secure Access Gateway</p>
                        </div>
                    </form>
                )}

                {/* ===== REGISTER FORM ===== */}
                {isRegister && (
                    <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in duration-300">
                        {/* Status Messages */}
                        {regSuccess && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold text-center animate-in fade-in zoom-in-95 duration-300">
                                ✓ {regSuccess}
                            </div>
                        )}
                        {regError && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-in fade-in zoom-in-95 duration-300">
                                ✕ {regError}
                            </div>
                        )}

                        {/* Account Credentials */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <input name="email" value={regData.email} onChange={handleRegChange} required className={inputClass} placeholder="your@email.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Password</label>
                                <input type="password" name="password" value={regData.password} onChange={handleRegChange} required className={inputClass} placeholder="••••••••" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                                <input type="password" name="re_password" value={regData.re_password} onChange={handleRegChange} required className={inputClass} placeholder="••••••••" />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 py-1">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Personal Details</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">First Name</label>
                                <input name="first_name" value={regData.first_name} onChange={handleRegChange} required className={inputClass} placeholder="Juan" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Last Name</label>
                                <input name="last_name" value={regData.last_name} onChange={handleRegChange} required className={inputClass} placeholder="Dela Cruz" />
                            </div>
                        </div>

                        {/* DOB + Gender */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Date of Birth</label>
                                <input type="date" name="dob" value={regData.dob} onChange={handleRegChange} required className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Gender</label>
                                <select name="gender" value={regData.gender} onChange={handleRegChange} required className={`${inputClass} appearance-none`}>
                                    <option value="M" className="bg-slate-800">Male</option>
                                    <option value="F" className="bg-slate-800">Female</option>
                                    <option value="O" className="bg-slate-800">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Phone + Address */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                <input name="phone" value={regData.phone} onChange={handleRegChange} className={inputClass} placeholder="09XX XXX XXXX" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Address</label>
                                <input name="address" value={regData.address} onChange={handleRegChange} className={inputClass} placeholder="City, Province" />
                            </div>
                        </div>

                        <button type="submit" disabled={regLoading} className="relative w-full group overflow-hidden rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95 mt-2">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative px-6 py-4 text-white font-black text-sm uppercase tracking-[0.15em] flex justify-center items-center">
                                {regLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className="opacity-90">Creating Account...</span>
                                    </div>
                                ) : 'Create Patient Account'}
                            </div>
                        </button>
                        
                        <div className="text-center mt-4">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Patient Self-Registration Portal</p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;