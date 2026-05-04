import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface ActivateProps {
    uid: string;
    token: string;
}

const Activate: React.FC<ActivateProps> = ({ uid, token }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const activate = async () => {
            try {
                await axios.post('http://127.0.0.1:8000/auth/users/activation/', { uid, token });
                setStatus('success');
                setMessage('Your account has been activated successfully! You can now sign in.');
            } catch (err: any) {
                setStatus('error');
                let detail = err.response?.data?.detail || err.response?.data?.uid?.[0] || err.response?.data?.token?.[0] || 'Activation failed.';
                
                // If token is invalid on the first try, it might already be activated
                if (detail === 'Invalid token for given user.') {
                    detail = 'This link is invalid or has expired. Your account may already be activated.';
                }
                
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
        <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] p-4 font-sans relative overflow-hidden">
            
            <div className="bg-white border border-slate-200 w-full max-w-[420px] p-10 rounded-2xl shadow-xl relative z-10 text-center">
                <div className="mb-8">
                    <div className="w-16 h-16 mx-auto bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-[#556ee6]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mt-5">MedFlow</h2>
                    <p className="text-[#556ee6] text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">Account Activation</p>
                </div>

                {status === 'loading' && (
                    <div className="space-y-6 animate-pulse">
                        <div className="w-12 h-12 mx-auto border-4 border-slate-100 border-t-[#556ee6] rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-sm font-medium">Activating your account...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 mx-auto bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Account Activated!</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
                        </div>
                        <button 
                            onClick={goToLogin}
                            className="w-full mt-4 bg-[#556ee6] hover:bg-[#485ec4] text-white rounded-xl py-3.5 px-6 font-bold text-[12px] uppercase tracking-widest transition-all shadow-md shadow-[#556ee6]/20 active:scale-[0.98] flex justify-center items-center"
                        >
                            Go to Sign In
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 mx-auto bg-red-50 border border-red-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Activation Failed</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
                        </div>
                        <button 
                            onClick={goToLogin}
                            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl py-3.5 px-6 font-bold text-[12px] uppercase tracking-widest transition-all active:scale-[0.98] flex justify-center items-center"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activate;
