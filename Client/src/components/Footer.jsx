import React from 'react';
import { GraduationCap, Mail, Phone, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Upper Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand Box */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/10">
                                <GraduationCap size={18} />
                            </div>
                            <span className="text-lg font-black text-white tracking-tight">
                                Eduvera
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                            A centralized verification ledger and student migration standard, tracking educational timelines securely from early school grades up through graduation levels.
                        </p>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-xl border border-gray-800 w-fit">
                            <ShieldCheck size={14} className="text-blue-400 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">SSL Encrypted Registry</span>
                        </div>
                    </div>

                    {/* Navigation Block */}
                    <div className="space-y-4 text-left">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-blue-500 pl-2">Portal Navigation</h4>
                        <ul className="space-y-2 text-sm font-semibold">
                            <li>
                                <a href="#track" className="hover:text-blue-400 transition-colors">Search Verification Registry</a>
                            </li>
                            <li>
                                <a href="#features" className="hover:text-blue-400 transition-colors">Core Features</a>
                            </li>
                            <li>
                                <a href="#statistics" className="hover:text-blue-400 transition-colors">Board Network State</a>
                            </li>
                            <li>
                                <a href="#" onClick={handleScrollToTop} className="hover:text-blue-400 transition-colors">Back to Top</a>
                            </li>
                        </ul>
                    </div>

                    {/* Security & Audit Links */}
                    <div className="space-y-4 text-left">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-2">Audit & Guidelines</h4>
                        <ul className="space-y-2 text-sm font-semibold">
                            <li>
                                <span className="hover:text-gray-200 cursor-help transition-colors">Institution Verification Policy</span>
                            </li>
                            <li>
                                <span className="hover:text-gray-200 cursor-help transition-colors">Timeline Audit Standards</span>
                            </li>
                            <li>
                                <span className="hover:text-gray-200 cursor-help transition-colors">Centralized Student Registry Policy</span>
                            </li>
                            <li>
                                <span className="hover:text-gray-200 cursor-help transition-colors">Legal Board Declarations</span>
                            </li>
                        </ul>
                    </div>

                 

                </div>

                {/* Lower Row Footer Section */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
                    <p className="text-gray-500">
                        &copy; {new Date().getFullYear()} Eduvera. All rights reserved. Central Education Board Authority.
                    </p>
                    <div className="flex items-center gap-4 text-gray-500">
                        <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
                        <span>&middot;</span>
                        <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
                        <span>&middot;</span>
                        <span className="hover:text-gray-400 cursor-pointer">Data Encryption Standard</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
