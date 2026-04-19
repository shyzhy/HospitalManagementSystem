import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
    onLoginSuccess: (token: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Get the auth token
            const tokenRes = await axios.post('http://127.0.0.1:8000/auth/token/login/', { username, password });
            const token = tokenRes.data.auth_token;

            // 2. Fetch the user's profile details
            const userRes = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
                headers: { Authorization: `Token ${token}` }
            });
            
            const userData = userRes.data;
            let role = userData.is_staff ? 'admin' : (userData.is_doctor ? 'doctor' : 'patient');

            // --- SAVING IDs & NAME TO BROWSER MEMORY ---

            // Save the user's name for the Welcome message
            const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            const displayName = fullName || userData.username || 'User';
            localStorage.setItem('userName', displayName);

            // Save Patient ID (if applicable)
            if (userData.patient_id) {
                localStorage.setItem('patientId', String(userData.patient_id));
            } else {
                localStorage.removeItem('patientId');
            }

            // Save Doctor ID (if applicable)
            if (userData.doctor_id) {
                localStorage.setItem('doctorId', String(userData.doctor_id));
            } else {
                localStorage.removeItem('doctorId');
            }

            // Trigger the login success callback to change the screen
            onLoginSuccess(token, role);
        } catch (err) {
            alert("Login Failed: Check credentials.");
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 font-sans relative overflow-hidden">
            {/* Ambient Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-500/20 blur-[100px] mix-blend-screen pointer-events-none"></div>
            
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 w-full max-w-[420px] p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative z-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <span className="text-4xl text-white">🏥</span>
                    </div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-tighter mt-6">MedFlow</h2>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Hospital Management System</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <input 
                                className="w-full p-4 pl-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-0 focus:border-blue-400 font-medium text-white placeholder:text-slate-500 transition-all focus:bg-white/10" 
                                placeholder="Username" 
                                onChange={e => setUsername(e.target.value)} 
                                required 
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity -z-10 blur-md hidden group-focus-within:block"></div>
                        </div>

                        <div className="relative group">
                            <input 
                                type="password" 
                                className="w-full p-4 pl-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-0 focus:border-blue-400 font-medium text-white placeholder:text-slate-500 transition-all focus:bg-white/10" 
                                placeholder="Password" 
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
            </div>
        </div>
    );
};

export default Login;