import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ArrowRightLeft, Users, Search, History, LogOut, Building } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
   
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="flex flex-col h-full">
           <h1 className="p-6 font-bold text-xl text-gray-900">Dashboard</h1>
            <nav className='flex-1 space-y-2 p-4'>
               
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                            ? "bg-gray-900 text-white shadow-md"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        }`
                    }
                >
                    <LayoutDashboard size={20} />
                    Home
                </NavLink>

               
                {user?.role === 'school' && (
                    <>
                        <NavLink
                            to="/dashboard/addStudent"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`
                            }
                        >
                            <UserPlus size={20} />
                            Add Fresh Student
                        </NavLink>               
                        <NavLink
                            to="/dashboard/enroll"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`
                            }
                        >
                            <ArrowRightLeft size={20} />
                            Enroll Student
                        </NavLink>
                    </>
                )}

                {user?.role === 'admin' && (
                    <>
                        <NavLink
                            to="/dashboard/addSchool"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Building size={20} />
                            Register School
                        </NavLink>
                        
                        <NavLink
                            to="/dashboard/schools"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Building size={20} />
                            Listed Schools
                        </NavLink>
                    </>
                )}

                {user?.role === 'school' && (
                    <>
                        <NavLink
                            to="/dashboard/students"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Users size={20}/>
                            Current Students   
                        </NavLink>
                        <NavLink
                            to="/dashboard/search"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Search size={20} />
                            Search Student
                        </NavLink>
                    </>
                )}
            </nav>
            <div className="p-4 border-t border-gray-100">
                <div className="mb-4 px-4 py-2 bg-gray-50 rounded-lg">
                    {user?.role === 'admin' ? (
                        <p className="text-sm font-bold text-gray-900">Admin</p>
                    ) : (
                        <>
                            <p className="text-sm font-bold text-gray-900">{user?.name || "Institution"}</p>
                            <p className="text-xs text-gray-500 font-mono">ID: {user?.id}</p>
                        </>
                    )}
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    )
}
export default Sidebar;
