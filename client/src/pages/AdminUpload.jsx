import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldCheck, CloudUpload } from 'lucide-react';

const AdminUpload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigate = useNavigate();

    const categories = ['General', 'Technical', 'Legal', 'Financial', 'Personal', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setMessage('Please select a PDF file');

        setIsLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('pdf', file);

        try {
            await API.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            navigate('/dashboard');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Error uploading file. Please try again.');
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setMessage('');
            if (!title) setTitle(selectedFile.name.replace('.pdf', ''));
        } else {
            setFile(null);
            setMessage('Please select a valid PDF file');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 -right-4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center text-sm font-black text-slate-400 hover:text-slate-900 mb-8 transition-colors group uppercase tracking-widest"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Terminal
                </Link>

                <div className="glass rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden">
                    <div className="p-8 sm:p-16">
                        <div className="text-center mb-12">
                            <div className="mx-auto h-20 w-20 bg-primary-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-primary-500/30">
                                <CloudUpload className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Publish Document</h1>
                            <p className="mt-2 text-slate-500 font-medium">Encrypt and distribute secure PDFs to the network</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Document Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter document title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Description (Optional)</label>
                                <textarea
                                    placeholder="Enter document summary..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium h-24 resize-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Classification</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold appearance-none cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Security Payload (PDF)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        required={!file}
                                    />
                                    <div className={`border-2 border-dashed rounded-[2.5rem] p-12 transition-all flex flex-col items-center justify-center space-y-4 ${file ? 'border-primary-500 bg-primary-50/50 backdrop-blur-sm' : 'border-slate-200 bg-white/50 group-hover:border-primary-400 group-hover:bg-primary-50/30'}`}>
                                        {file ? (
                                            <>
                                                <div className="h-20 w-20 bg-primary-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-primary-500/20 transform rotate-3">
                                                    <FileText className="h-10 w-10 text-white" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-black text-slate-900">{file.name}</p>
                                                    <p className="text-xs font-bold text-primary-600 uppercase mt-1 tracking-widest">Checked & Validated • {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                    className="px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-colors uppercase tracking-widest"
                                                >
                                                    Change Document
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                    <Upload className="h-7 w-7 text-slate-400 group-hover:text-primary-500" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-bold text-slate-700">Drop security file here or click to browse</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase mt-2 tracking-[0.2em]">Validated PDF Format Only • Max 10MB</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`flex items-center space-x-3 p-5 rounded-[1.5rem] text-sm border ${message.includes('Error') || message.includes('select') ? 'text-red-600 bg-red-50/50 border-red-100' : 'text-primary-600 bg-primary-50/50 border-primary-100'}`}>
                                    {message.includes('Error') || message.includes('select') ? <AlertCircle className="h-5 w-5 flex-shrink-0" /> : <ShieldCheck className="h-5 w-5 flex-shrink-0" />}
                                    <span className="font-bold">{message}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !file || !title}
                                className="btn-premium w-full relative group flex items-center justify-center py-5 px-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-3">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Encrypting {uploadProgress}%</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center space-x-2">
                                        <ShieldCheck className="h-5 w-5" />
                                        <span>Confirm and Publish</span>
                                    </span>
                                )}

                                {isLoading && (
                                    <div
                                        className="absolute bottom-0 left-0 h-1.5 bg-primary-500 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 text-center p-8 rounded-[2rem] border border-slate-200">
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] italic">
                        "Document encryption happens on the fly. Unauthorized access is impossible."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminUpload;
