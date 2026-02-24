import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Mail, ArrowRight, Loader2, ShieldCheck, ArrowLeft, Fingerprint, AlertCircle } from 'lucide-react';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);

    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;
    const name = location.state?.name;
    const isRegistration = location.state?.isRegistration;

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = async () => {
        if (!canResend) return;
        setIsLoading(true);
        setMessage('');
        try {
            await API.post('/api/auth/send-otp', { email, name, isRegistration });
            setTimer(60);
            setCanResend(false);
            setMessage('A new code has been dispatched to your terminal.');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'System congestion. Try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const res = await API.post('/api/auth/verify-otp', { email, otp });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Invalid verification code');
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

                <div className="max-w-md w-full glass p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative z-10 text-center space-y-6">
                    <div className="mx-auto h-20 w-20 bg-red-100 rounded-[2rem] flex items-center justify-center mb-4">
                        <AlertCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Session Expired</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">Please return to the login page to request a new secure access token.</p>
                    </div>
                    <Link to="/login" className="btn-premium inline-flex items-center space-x-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Return to Login</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full space-y-8 glass p-10 rounded-[2.5rem] shadow-2xl shadow-primary-500/10 border border-white/50 relative z-10 transition-all duration-500 hover:shadow-primary-500/20">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-primary-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-primary-500/30 transform transition-transform hover:-rotate-12 duration-300">
                        <Fingerprint className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Verify Identity
                    </h2>
                    <p className="text-slate-500 font-medium px-4">
                        Enter the 6-digit code sent to <br /><span className="text-primary-600 font-bold">{email}</span>
                    </p>
                </div>

                <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="000 000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength="6"
                                className="block w-full px-4 py-6 text-center text-4xl font-black tracking-[0.3em] bg-white/50 border border-slate-200 rounded-[2rem] text-slate-900 focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-200 placeholder:tracking-normal"
                            />
                        </div>

                        {message && (
                            <div className={`flex items-center space-x-3 p-4 rounded-2xl text-sm border animate-in fade-in slide-in-from-top-2 ${message.includes('dispatched') ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="font-semibold">{message}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-premium group relative w-full flex justify-center py-4 px-6 text-sm font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/10 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                            ) : (
                                "Complete Verification"
                            )}
                        </button>

                        <div className="text-center space-y-2">
                            <p className="text-xs font-medium text-slate-400">
                                Didn't receive the secure payload?
                            </p>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={!canResend || isLoading}
                                className={`text-xs font-black uppercase tracking-widest transition-colors ${canResend ? 'text-primary-600 hover:text-primary-700 underline underline-offset-4' : 'text-slate-300 cursor-not-allowed'}`}
                            >
                                {timer > 0 ? `Resend available in ${timer}s` : 'Request New Token'}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                        Two-Factor Authentication
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
