import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ActivateProps {
    uid: string;
    token: string;
}

const Activate: React.FC<ActivateProps> = ({ uid, token }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const activate = async () => {
            try {
                await axios.post('http://127.0.0.1:8000/auth/users/activation/', { uid, token });
                setStatus('success');
                setMessage('Your account has been activated successfully!');
            } catch (err: any) {
                setStatus('error');
                const detail = err.response?.data?.detail || err.response?.data?.uid?.[0] || err.response?.data?.token?.[0] || 'Activation failed. The link may have expired or already been used.';
                setMessage(detail);
            }
        };
        activate();
    }, [uid, token]);

    const goToLogin = () => {
        window.history.replaceState({}, '', '/');
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 font-sans relative overflow-hidden">
            {/* Ambient Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-500/20 blur-[100px] mix-blend-screen pointer-events-none"></div>
            
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 w-full max-w-[420px] p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative z-10 text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <span className="text-4xl text-white">🏥</span>
                    </div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-tighter mt-6">MedFlow</h2>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Account Activation</p>
                </div>

                {status === 'loading' && (
                    <div className="space-y-6 animate-pulse">
                        <div className="w-16 h-16 mx-auto border-4 border-white/10 border-t-emerald-400 rounded-full animate-spin"></div>
                        <p className="text-white/60 text-sm font-medium">Activating your account...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 mx-auto bg-emerald-500/10 border-2 border-emerald-500/20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white mb-2">Account Activated!</h3>
                            <p className="text-white/50 text-sm">{message}</p>
                        </div>
                        <button 
                            onClick={goToLogin}
                            className="relative w-full group overflow-hidden rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative px-6 py-4 text-white font-black text-sm uppercase tracking-[0.15em]">
                                Go to Sign In
                            </div>
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 mx-auto bg-red-500/10 border-2 border-red-500/20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white mb-2">Activation Failed</h3>
                            <p className="text-white/50 text-sm">{message}</p>
                        </div>
                        <button 
                            onClick={goToLogin}
                            className="relative w-full group overflow-hidden rounded-2xl transition-all active:scale-95"
                        >
                            <div className="absolute inset-0 w-full h-full bg-white/10 group-hover:bg-white/15 transition-all"></div>
                            <div className="relative px-6 py-4 text-white/80 font-black text-sm uppercase tracking-[0.15em]">
                                Back to Login
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activate;
