import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const Watermark = () => {
    const { user } = useAuth();
    const [screenshotWarning, setScreenshotWarning] = useState(false);

    useEffect(() => {
        // Prevent PrintScreen key by detecting it
        const handleKeyUp = (e) => {
            if (e.key === 'PrintScreen') {
                setScreenshotWarning(true);
                navigator.clipboard.writeText('Screenshots are disabled for security reasons.');
                setTimeout(() => setScreenshotWarning(false), 3000);
            }
        };

        const handleContext = (e) => e.preventDefault();
        
        // When window loses focus, trigger visual protection
        const handleBlur = () => setScreenshotWarning(true);
        const handleFocus = () => setScreenshotWarning(false);

        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('contextmenu', handleContext);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('contextmenu', handleContext);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    if (!user) return null;

    // Create a grid of watermarks
    const watermarks = Array(40).fill(`${user.mobile} | ${user.email}`);

    return (
        <>
            {/* Massive warning overlay on PrintScreen or Window Blur */}
            {screenshotWarning && (
                <div className="fixed inset-0 z-[10000] bg-slate-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
                    <ShieldAlert className="h-24 w-24 text-red-500 mb-8 animate-pulse" />
                    <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Security Interruption</h2>
                    <p className="text-xl text-slate-400 max-w-2xl font-medium">Screen capture or window focus loss detected. The view has been obfuscated to protect the document.</p>
                    <div className="mt-12 px-6 py-3 rounded-full border border-red-500/30 bg-red-500/10 text-xs font-black uppercase tracking-[0.2em] text-red-500">
                        Identity logged: {user.mobile} | {user.email}
                    </div>
                </div>
            )}

            <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden opacity-[0.03] select-none">
                {/* Anti-print block style */}
                <style>
                    {`
                        @media print {
                            body * {
                                visibility: hidden !important;
                            }
                            body::after {
                                content: "Content securely protected.";
                                visibility: visible !important;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                font-size: 2vw;
                            }
                        }
                    `}
                </style>
                
                <div className="w-[200vw] h-[200vw] -ml-[50vw] -mt-[50vw] flex flex-wrap justify-around items-center -rotate-45 scale-150">
                    {watermarks.map((text, i) => (
                        <div key={i} className="text-4xl font-extrabold text-black whitespace-nowrap p-16 tracking-widest">
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Watermark;
