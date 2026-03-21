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
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
            <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl">
                <div className="text-center mb-10">
                    <span className="text-5xl">🏥</span>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mt-4">MedFlow</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Hospital Management System</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-5">
                    <input 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700" 
                        placeholder="Username" 
                        onChange={e => setUsername(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700" 
                        placeholder="Password" 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest shadow-xl hover:bg-emerald-700 active:scale-95 transition-all">
                        {loading ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;