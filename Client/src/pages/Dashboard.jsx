import React, {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRightLeft, Search, Users, LogOut, Building } from 'lucide-react';

const Dashboard = () => {
    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-300 relative">
            
            {/* Top Right Logout Button */}
            <div className="absolute top-0 right-0">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Institution Dashboard</h1>
                <p className="text-lg text-gray-500">Select an action to manage your students.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {user?.role === 'school' && (
                    <>
                        <Link to="/dashboard/addStudent" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <UserPlus size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Enroll Fresh Student</h3>
                            <p className="text-gray-500 text-sm">Register a completely new student into the education system.</p>
                        </Link>

                        <Link to="/dashboard/transfer" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ArrowRightLeft size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Enroll Existing Student</h3>
                            <p className="text-gray-500 text-sm">Enroll a student who has transferred from another institution.</p>
                        </Link>

                        <Link to="/dashboard/students" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Current Students</h3>
                            <p className="text-gray-500 text-sm">View and manage the roster of all active students in your school.</p>
                        </Link>

                        <Link to="/dashboard/search" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Search Records</h3>
                            <p className="text-gray-500 text-sm">Look up any student's global educational timeline via Unique ID.</p>
                        </Link>
                    </>
                )}

                {user?.role === 'admin' && (
                    <>
                        <Link to="/dashboard/addSchool" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Building size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Register New School</h3>
                            <p className="text-gray-500 text-sm">Create a brand new school entity and generate login credentials.</p>
                        </Link>
                        
                        <Link to="/dashboard/schools" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Building size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Listed Schools</h3>
                            <p className="text-gray-500 text-sm">View the directory of all institutions registered under the Board.</p>
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
