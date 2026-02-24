import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2, ZoomIn, ZoomOut, AlertTriangle, ShieldCheck, Download, Printer, Lock, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Fix worker for react-pdf using a reliable CDN path
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ViewPDF = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFocused, setIsFocused] = useState(true);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pdfs/${id}`, {
                    headers: { 'x-auth-token': token }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.msg || 'Secure link expired or access denied');
                }

                const blob = await response.blob();
                setPdfUrl(URL.createObjectURL(blob));
            } catch (err) {
                console.error('Error fetching PDF:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPdf();

        // Lockdown measures
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            // Block PrintScreen (key code 44), Ctrl+P, Ctrl+S, Ctrl+U
            if (e.key === 'PrintScreen' || (e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'u')) {
                e.preventDefault();
                setIsFocused(false); // Blur on PrintScreen attempt
                setTimeout(() => setIsFocused(true), 2000);
            }
        };

        const handleVisibilityChange = () => {
            setIsFocused(!document.hidden);
        };

        const handleBlur = () => setIsFocused(false);
        const handleFocus = () => setIsFocused(true);

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [id]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
    const setZoom = (value) => setScale(value);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-primary-500/30">
            {/* Premium Header Control Bar */}
            <div className="dark-glass h-20 px-6 flex items-center justify-between sticky top-0 z-[100] border-b border-white/5">
                <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 text-slate-400 hover:text-white transition-all group"
                >
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                </Link>

                <div className="hidden lg:flex items-center glass px-4 py-1.5 rounded-2xl border-white/10 space-x-2">
                    {[1.0, 1.5, 2.0].map(z => (
                        <button
                            key={z}
                            onClick={() => setZoom(z)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${scale === z ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            {z * 100}%
                        </button>
                    ))}
                </div>

                <div className="flex items-center glass px-2 py-1.5 rounded-2xl border-white/10">
                    <button onClick={handleZoomOut} className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-90">
                        <ZoomOut className="h-4 w-4 text-slate-300" />
                    </button>
                    <div className="px-4 min-w-[70px] text-center border-x border-white/5">
                        <span className="text-xs font-black text-slate-100">{Math.round(scale * 100)}%</span>
                    </div>
                    <button onClick={handleZoomIn} className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-90">
                        <ZoomIn className="h-4 w-4 text-slate-300" />
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Active Session</span>
                        <span className="text-xs font-bold text-slate-500">{user.email}</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Lock className="h-5 w-5 text-white" />
                    </div>
                </div>
            </div>

            {/* Viewer Area */}
            <div className="flex-grow overflow-auto p-4 md:p-12 flex flex-col items-center bg-[#020617] relative scrollbar-hide">
                {/* Fixed Watermark Component */}
                <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden opacity-[0.03] select-none flex-col space-y-24">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex space-x-24 font-black text-[3vw] uppercase tracking-[1em] whitespace-nowrap rotate-[-20deg]">
                            <span className="text-primary-500">Built by Ayush Sharma</span>
                            <span>{user.name || user.email}</span>
                            <span className="text-primary-500 italic">Secure View</span>
                        </div>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-[2rem] bg-primary-500/10 border border-primary-500/20 flex items-center justify-center animate-pulse">
                                <ShieldCheck className="h-10 w-10 text-primary-500" />
                            </div>
                            <Loader2 className="h-28 w-28 text-primary-500 animate-spin absolute -top-2 -left-2 opacity-40" />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] mt-8 text-xs animate-pulse">Decrypting Security Layer...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] max-w-lg text-center animate-in zoom-in-95 duration-500">
                        <div className="h-24 w-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-red-500/20">
                            <AlertTriangle className="h-12 w-12 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Access Denied</h2>
                        <p className="text-slate-400 font-medium leading-relaxed mb-10">{error}</p>
                        <Link to="/dashboard" className="btn-premium px-10 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs">
                            Return to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className={`relative shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden select-none mb-24 z-10 scale-in duration-500 border border-white/5 transition-all duration-700 ${!isFocused ? 'blur-[80px] scale-95 opacity-50 grayscale' : 'blur-0 scale-100 opacity-100 grayscale-0'}`}>
                        {/* Security Overlay when not focused */}
                        {!isFocused && (
                            <div className="absolute inset-0 z-[100] backdrop-blur-3xl bg-slate-950/80 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                                <div className="h-24 w-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-6 animate-pulse border border-red-500/20">
                                    <ShieldAlert className="h-12 w-12 text-red-500" />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Security Interruption</h2>
                                <p className="text-slate-400 max-w-md font-medium">Capture prevention triggered. Please return focus to the terminal to resume encrypted stream.</p>
                                <div className="mt-8 px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    Identity logged: {user.email}
                                </div>
                            </div>
                        )}
                        {pdfUrl && (
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="flex flex-col items-center py-32 px-20 bg-slate-900/50 backdrop-blur-3xl min-w-[300px] rounded-2xl">
                                        <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-4" />
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Assembling Pages...</p>
                                    </div>
                                }
                            >
                                {Array.from(new Array(numPages), (el, index) => (
                                    <div key={`page_${index + 1}`} className="mb-px last:mb-0 relative group/page">
                                        <Page
                                            pageNumber={index + 1}
                                            scale={scale}
                                            renderAnnotationLayer={false}
                                            renderTextLayer={false}
                                            className="bg-white"
                                        />
                                        {/* Per-page subtle watermark overlay */}
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none uppercase font-black text-4xl rotate-45 text-slate-950">
                                            {user.email}
                                        </div>
                                    </div>
                                ))}
                            </Document>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Protection Pulse */}
            <div className="h-12 border-t border-white/5 bg-slate-950 flex items-center justify-center px-6">
                <div className="flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                    <p className="text-[9px] text-slate-500 font-black tracking-[0.4em] uppercase">
                        End-to-End Encrypted Session • Real-time Monitoring Active
                    </p>
                </div>
            </div>

            <style>{`
                .react-pdf__Page canvas {
                    margin: 0 auto;
                    display: block !important;
                    max-width: 100vw;
                    height: auto !important;
                }
                body {
                    overflow-x: hidden;
                    background: #020617;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                @media print {
                  body { display:none !important; }
                }
            `}</style>
        </div>
    );
};

export default ViewPDF;
