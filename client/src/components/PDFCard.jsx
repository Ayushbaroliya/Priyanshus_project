import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Calendar, ShieldCheck, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PDFCard = ({ pdf, onDelete }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="card-hover group bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col h-full relative cursor-pointer">
            <div className="aspect-[4/5] bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden mb-4 transition-colors group-hover:bg-primary-50">
                {/* Decorative Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-4 left-4 h-24 w-24 border border-slate-900 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 h-32 w-32 border border-slate-900 rounded-full"></div>
                </div>

                {isAdmin && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(pdf._id);
                        }}
                        className="absolute top-4 right-4 z-20 h-10 w-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                )}

                <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                    <div className="h-24 w-18 bg-white shadow-2xl rounded-lg border border-slate-100 flex items-center justify-center">
                        <FileText className="h-10 w-10 text-primary-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-12">
                        <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                </div>

                <div className="absolute bottom-6 left-0 w-full px-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <Link
                        to={`/view-pdf/${pdf._id}`}
                        className="btn-premium flex items-center justify-center space-x-2 w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm shadow-xl"
                    >
                        <span>Open Document</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <div className="px-2 pb-2 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="h-1 w-4 bg-primary-400 rounded-full"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(pdf.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {pdf.title}
                </h3>

                <div className="flex items-center mt-1 space-x-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-500 rounded-md uppercase tracking-widest">
                        {pdf.category || 'General'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-tight uppercase">ID: {pdf._id.slice(-8)}</span>
                </div>
            </div>
        </div>
    );
};

export default PDFCard;
