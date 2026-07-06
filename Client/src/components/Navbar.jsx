import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, User, Menu, X, Landmark, ClipboardList } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsOpen(false);
    };

    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100/80 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    
                    {/* Brand Logo */}
                    <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <GraduationCap size={22} className="rotate-3" />
                        </div>
                        <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                            Eduvera
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {!user && (
                            <>
                                <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">Features</a>
                                <a href="#statistics" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">Network</a>
                                <a href="#track" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">Track Timeline</a>
                            </>
                        )}
                    </nav>

                    {/* User Profile / Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                        {user.name?.charAt(0) || 'I'}
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 max-w-[150px] truncate">
                                        {user.name}
                                    </span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-xl transition-all border border-transparent hover:border-red-100"
                                >
                                    <LogOut size={14} />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => {
                                    // Custom dispatch event or just scroll/navigate
                                    const event = new CustomEvent("show-login-portal");
                                    window.dispatchEvent(event);
                                }}
                                className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/10 hover:shadow-lg transition-all"
                            >
                                Institution Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2">
                    {!user ? (
                        <>
                            <a href="#features" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#statistics" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Network</a>
                            <a href="#track" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Track Timeline</a>
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    const event = new CustomEvent("show-login-portal");
                                    window.dispatchEvent(event);
                                }}
                                className="w-full text-center px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all mt-2"
                            >
                                Institution Login
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="px-3 py-2 bg-gray-50 rounded-lg mb-3">
                                <p className="text-xs text-gray-500 font-bold">LOGGED IN AS</p>
                                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                <p className="text-xs font-mono text-gray-500">ID: {user.id}</p>
                            </div>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Home</Link>
                            {user.role === 'school' && (
                                <>
                                    <Link to="/dashboard/students" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Students Roster</Link>
                                    <Link to="/dashboard/search" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Search Student</Link>
                                    <Link to="/dashboard/addStudent" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Add Student</Link>
                                    <Link to="/dashboard/enroll" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Enroll Student</Link>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/dashboard/schools" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Listed Schools</Link>
                                    <Link to="/dashboard/addSchool" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Register School</Link>
                                </>
                            )}
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-base font-bold text-red-600 hover:bg-red-50 transition-all mt-4 border border-red-100"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
