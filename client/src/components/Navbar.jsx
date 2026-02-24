import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Upload, FileText, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    console.log('Navbar: Render. User =', user);

    const handleLogout = () => {
        console.log('Navbar: Logging out...');
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const getInitials = (userName) => {
        if (!userName) return user.email?.charAt(0).toUpperCase() || '?';
        const parts = userName.split(' ').filter(Boolean);
        if (parts.length === 0) return user.email?.charAt(0).toUpperCase() || '?';
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <nav className="glass sticky top-0 z-[100] border-b border-white/50 px-4 sm:px-6 lg:px-8 h-20 flex items-center">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="h-10 w-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Udeniya<span className="text-primary-600">Secure</span></span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Terminal</span>
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin-upload" className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all">
                                <Upload className="h-4 w-4" />
                                <span>Publish</span>
                            </Link>
                        )}
                        <div className="h-4 w-px bg-slate-200 mx-4" />

                        <div className="flex items-center space-x-4 ml-2">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</span>
                                <span className="text-xs font-bold text-slate-900">{user.name || user.email.split('@')[0]}</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-black ring-4 ring-slate-100">
                                {getInitials(user.name)}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                title="Secure Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-24 left-4 right-4 glass p-6 rounded-[2rem] border border-white/50 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-4">
                        <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 p-4 rounded-2xl text-slate-600 font-bold hover:bg-primary-50 hover:text-primary-600 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Secure Terminal</span>
                        </Link>
                        {user.role === 'admin' && (
                            <Link
                                to="/admin-upload"
                                className="flex items-center space-x-3 p-4 rounded-2xl text-slate-600 font-bold hover:bg-primary-50 hover:text-primary-600 transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                <Upload className="h-5 w-5" />
                                <span>Publish Document</span>
                            </Link>
                        )}
                        <div className="h-px bg-slate-100 mx-2" />
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-black">
                                    {getInitials(user.name)}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900">{user.name || 'Secure User'}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
