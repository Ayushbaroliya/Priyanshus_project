import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2, UserX, Users, ShieldAlert, Phone, Mail, Clock, AlertTriangle } from 'lucide-react';

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (currentUser?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchUsers();
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        try {
            const res = await API.get('/api/admin/users');
            setUsers(res.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to securely retrieve user database.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you absolutely sure you want to delete this user? This action cannot be undone.")) return;
        
        setDeletingId(userId);
        try {
            await API.delete(`/api/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
            setMessage('User successfully purged from the system.');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err.response?.data?.msg || 'Failed to delete user.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 -right-4 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center text-sm font-black text-slate-400 hover:text-slate-900 mb-8 transition-colors group uppercase tracking-widest"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Terminal
                </Link>

                <div className="glass rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                            <div>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-slate-900/30">
                                        <Users className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Identity Registry</h1>
                                        <p className="mt-2 text-slate-500 font-medium">Manage and purge network access</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="glass px-6 py-4 rounded-2xl flex items-center space-x-3 border-red-100 bg-red-50/30">
                                <ShieldAlert className="h-5 w-5 text-red-500" />
                                <span className="text-xs font-black text-red-600 uppercase tracking-widest">High Clearance Area Actions are permanent</span>
                            </div>
                        </div>

                        {message && (
                            <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center space-x-3 animate-in fade-in">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-bold text-green-700">{message}</span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                <span className="text-sm font-bold">{error}</span>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                                <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary-500" />
                                <span className="text-xs font-black uppercase tracking-widest">Decrypting Identity Records...</span>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="py-24 text-center">
                                <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="h-10 w-10 text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-bold">No identities found in the system.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {users.map((u) => (
                                    <div key={u._id} className="glass p-6 rounded-[2rem] border border-white/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all group flex flex-col">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-lg font-black text-slate-900">
                                                    {u.name?.charAt(0).toUpperCase() || u.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 truncate max-w-[150px]">{u.name || 'Unknown Agent'}</h3>
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 ${u.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {u.role}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                disabled={deletingId === u._id || currentUser._id === u._id}
                                                className={`p-2 rounded-xl transition-all ${currentUser._id === u._id ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30'}`}
                                                title="Purge Identity"
                                            >
                                                {deletingId === u._id ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <UserX className="h-4 w-4" />}
                                            </button>
                                        </div>

                                        <div className="space-y-3 flex-grow">
                                            <div className="flex items-center space-x-3 text-sm text-slate-600 bg-white/50 p-3 rounded-xl">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                                <span className="font-medium truncate">{u.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm text-slate-600 bg-white/50 p-3 rounded-xl">
                                                <Phone className="h-4 w-4 text-slate-400" />
                                                <span className="font-medium font-mono">{u.mobile || 'No Mobile'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Profile Created</span>
                                            <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center p-8 rounded-[2rem] border border-slate-200">
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] italic">
                        "User purges are permanent and immediately revoke all active sessions."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
