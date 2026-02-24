import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import PDFCard from '../components/PDFCard';
import { Plus, Search, Filter, Loader2, FileWarning } from 'lucide-react';

const SkeletonCard = () => (
    <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-xl flex flex-col h-full animate-pulse">
        <div className="aspect-[4/5] bg-slate-100 rounded-[2rem] mb-4"></div>
        <div className="px-2 pb-2 space-y-3">
            <div className="h-4 w-24 bg-slate-100 rounded-full"></div>
            <div className="h-6 w-full bg-slate-100 rounded-full"></div>
            <div className="h-4 w-32 bg-slate-100 rounded-full"></div>
        </div>
    </div>
);

const Dashboard = () => {
    const [pdfs, setPdfs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { user } = useAuth();

    console.log('Dashboard: Render. User =', user);

    const fetchPdfs = async () => {
        setIsLoading(true);
        try {
            const res = await API.get('/api/pdfs/all');
            console.log('Dashboard: PDFs fetched:', res.data);
            setPdfs(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Dashboard: Error fetching PDFs', err);
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    useEffect(() => {
        if (user) fetchPdfs();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) return;

        try {
            await API.delete(`/api/admin/pdf/${id}`);
            setPdfs(pdfs.filter(pdf => pdf._id !== id));
        } catch (err) {
            console.error('Error deleting PDF', err);
            alert(err.response?.data?.msg || 'Error deleting PDF');
        }
    };

    const categories = ['All', 'General', 'Technical', 'Legal', 'Financial', 'Personal', 'Other'];

    const filteredPdfs = Array.isArray(pdfs) ? pdfs.filter(pdf => {
        const matchesSearch = (pdf.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || pdf.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }) : [];

    if (!user) {
        console.warn('Dashboard: No user in render, relying on ProtectedRoute for redirect.');
        return null;
    }

    const userNameDisplay = user.name || user.email?.split('@')[0] || 'User';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        Welcome back, <span className="text-primary-600">{userNameDisplay}</span>
                        <span className="inline-block animate-bounce">👋</span>
                    </h1>
                    <p className="mt-2 text-slate-500 font-medium">Access your secure document vault and encrypted payloads.</p>
                </div>

                {user.role === 'admin' && (
                    <Link to="/admin-upload">
                        <button className="btn-premium flex items-center justify-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95">
                            <Plus className="h-5 w-5" />
                            <span>Publish Document</span>
                        </button>
                    </Link>
                )}
            </div>

            <div className="glass p-6 rounded-[2.5rem] border border-white/50 shadow-xl mb-12 flex flex-col lg:flex-row gap-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search document registry..."
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white/50 text-slate-500 hover:bg-white hover:text-primary-600 border border-slate-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filteredPdfs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredPdfs.map(pdf => (
                        <PDFCard key={pdf._id} pdf={pdf} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 glass rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="h-20 w-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <FileWarning className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">No matching documents</h3>
                    <p className="text-slate-500 mt-2 font-medium">The security registry found no documents matching your criteria.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="mt-8 text-primary-600 font-bold uppercase tracking-widest text-xs hover:text-primary-700 underline underline-offset-8"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;