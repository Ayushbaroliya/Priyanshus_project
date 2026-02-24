import React, { useState } from 'react';
import {
    FileText,
    Search,
    Plus,
    Filter,
    Eye,
    Calendar,
    Mail,
    KeyRound,
    Menu,
    X,
    LayoutDashboard,
    Upload,
    LogOut
} from 'lucide-react';

const UIDemo = () => {
    const [view, setView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Mock Data
    const mockPdfs = [
        { _id: '1', title: 'Q4 Financial Report 2025.pdf', createdAt: new Date().toISOString() },
        { _id: '2', title: 'Architecture Design System.pdf', createdAt: new Date().toISOString() },
        { _id: '3', title: 'Employee Handbook v2.pdf', createdAt: new Date().toISOString() },
        { _id: '4', title: 'Project Roadmap - Alpha.pdf', createdAt: new Date().toISOString() },
    ];

    const DemoNavbar = () => (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900 tracking-tight">PDFHub</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <button onClick={() => setView('dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>Dashboard</button>
                        <button onClick={() => setView('login')} className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'login' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>Login Demo</button>
                        <div className="h-6 w-px bg-gray-200 mx-2" />
                        <span className="text-sm text-gray-500">demo@example.com</span>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-400">
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 px-2 pt-2 pb-3 space-y-1">
                    <button onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false) }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Dashboard</button>
                    <button onClick={() => { setView('login'); setIsMobileMenuOpen(false) }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Login Demo</button>
                </div>
            )}
        </nav>
    );

    const DashboardDemo = () => (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Documents</h1>
                    <p className="mt-1 text-gray-500">Modern Dashboard Layout Preview</p>
                </div>
                <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] transform">
                    <Plus className="h-5 w-5" />
                    <span>Upload New PDF</span>
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Search documents..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                    <Filter className="h-5 w-5" />
                    <span>Filter</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockPdfs.map(pdf => (
                    <div key={pdf._id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                        <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative group-hover:bg-blue-50/50 transition-colors">
                            <FileText className="h-16 w-16 text-blue-200 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-4">{pdf.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{new Date(pdf.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button className="flex items-center justify-center space-x-2 w-full bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                                <Eye className="h-4 w-4" />
                                <span>View Document</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const LoginDemo = () => (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                        <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
                    <p className="mt-2 text-sm text-gray-500">UI Preview: Enter your email to see the logic</p>
                </div>
                <div className="mt-8 space-y-6">
                    <input type="email" placeholder="name@company.com" className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm" />
                    <button className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all transform active:scale-[0.98]">
                        Send Magic Link
                    </button>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Secure OTP Login</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <DemoNavbar />
            {view === 'dashboard' ? <DashboardDemo /> : <LoginDemo />}

            <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl z-50">
                🚀 UI PREVIEW MODE
            </div>
        </div>
    );
};

export default UIDemo;
