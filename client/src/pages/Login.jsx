import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    React.useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Changed setMessage to setError
        try {
            await API.post('/api/auth/send-otp', { email, isRegistration: false });
            navigate('/verify-otp', { state: { email, isRegistration: false } });
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to send OTP. Please try again.'); // Changed setMessage to setError
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full space-y-8 glass p-10 rounded-[2.5rem] shadow-2xl shadow-primary-500/10 border border-white/50 relative z-10 transition-all duration-500 hover:shadow-primary-500/20">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-primary-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-primary-500/30 transform transition-transform hover:rotate-12 duration-300">
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Secure Access
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Verification required for document access
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-11 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium"
                            placeholder="Email Address"
                        />
                    </div>

                    {error && ( // Changed message to error
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
                            <div className="h-1.5 w-1.5 bg-red-600 rounded-full animate-pulse"></div>
                            <span>{error}</span> {/* Changed message to error */}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-premium w-full flex items-center justify-center space-x-2 bg-slate-900 text-white py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <span>Get Access Token</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-black hover:text-primary-700 transition-colors uppercase tracking-widest text-xs">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                        Encrypted Security Layer
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
