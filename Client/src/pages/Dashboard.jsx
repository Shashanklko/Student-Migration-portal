import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRightLeft, Search, Users, LogOut, Building, ShieldCheck, Landmark, GraduationCap, Key, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Stats state
    const [stats, setStats] = useState({
        total: 0,
        schools: 0,
        universities: 0
    });
    const [loadingStats, setLoadingStats] = useState(false);

    // Reset Requests for Admin
    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    // School Admin state
    const [schoolPassInfo, setSchoolPassInfo] = useState(null);
    const [loadingSchoolPass, setLoadingSchoolPass] = useState(false);
    const [newSchoolPass, setNewSchoolPass] = useState("");
    const [updatingSchoolPass, setUpdatingSchoolPass] = useState(false);

    // Fetch stats & requests for Admin, password for School Admin
    const fetchAdminData = async () => {
        setLoadingStats(true);
        try {
            const res = await axios.get('/api/schools');
            const schoolsList = res.data;
            const schCount = schoolsList.filter(s => s.id.startsWith("SCH")).length;
            const univCount = schoolsList.length - schCount;
            
            setStats({
                total: schoolsList.length,
                schools: schCount,
                universities: univCount
            });
        } catch (err) {
            console.error("Failed to load dashboard stats", err);
        } finally {
            setLoadingStats(false);
        }

        setLoadingRequests(true);
        try {
            const res = await axios.get('/api/admin/reset-requests');
            setRequests(res.data.filter(r => r.status === "Pending"));
        } catch (err) {
            console.error("Failed to load reset requests", err);
        } finally {
            setLoadingRequests(false);
        }
    };

    const fetchSchoolAdminData = async () => {
        setLoadingSchoolPass(true);
        try {
            const sId = user.schoolId;
            const res = await axios.get(`/api/school-admin/password/${sId}`);
            setSchoolPassInfo(res.data);
        } catch (err) {
            console.error("Failed to load school credentials", err);
        } finally {
            setLoadingSchoolPass(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAdminData();
        } else if (user?.role === 'school-admin') {
            fetchSchoolAdminData();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Admin resets password for a school
    const handleApproveReset = async (reqId, schoolId, schoolName) => {
        const newPass = window.prompt(`Enter new password for ${schoolName} (${schoolId}):`);
        if (newPass && newPass.trim() !== '') {
            try {
                // 1. Update password
                await axios.put(`/api/schools/${schoolId}/password`, { password: newPass });
                // 2. Resolve request
                await axios.post(`/api/admin/reset-requests/${reqId}/resolve`);
                alert(`Password for ${schoolName} reset successfully!\nNew Passcode: ${newPass}`);
                fetchAdminData(); // refresh list
            } catch (err) {
                alert("Failed to reset password");
            }
        }
    };

    const handleImpersonateAdmin = (schoolId, schoolName) => {
        const adminUser = {
            id: `A-${schoolId}`,
            role: 'school-admin',
            name: `${schoolName} (Admin)`,
            schoolId: schoolId
        };
        login(adminUser);
        navigate('/dashboard');
    };

    // School Admin changes password directly
    const handleSchoolPassUpdate = async (e) => {
        e.preventDefault();
        if (!newSchoolPass.trim()) return;
        setUpdatingSchoolPass(true);
        try {
            const sId = user.schoolId;
            await axios.put(`/api/schools/${sId}/password`, { password: newSchoolPass });
            alert("Institution password successfully updated!");
            setNewSchoolPass("");
            fetchSchoolAdminData(); // refresh current display
        } catch (err) {
            alert("Failed to update password");
        } finally {
            setUpdatingSchoolPass(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300 relative text-left">
            
            {/* Top Row: Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4 pointer-events-none">
                    <GraduationCap size={240} />
                </div>
                
                <div className="space-y-2 relative z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-blue-100 uppercase tracking-wider border border-white/10">
                        <ShieldCheck size={12} /> Secure Auth Panel
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black">
                        {user?.role === 'admin' && "Eduvera Board Control"}
                        {user?.role === 'school-admin' && `${user.name}`}
                        {user?.role === 'school' && `Portal: ${user.name}`}
                    </h1>
                    <p className="text-sm text-blue-100 font-semibold max-w-xl">
                        {user?.role === 'admin' && "Central Administrative Console. Manage institution authorizations, registry keys, and directory details."}
                        {user?.role === 'school-admin' && `Institution Administrator Dashboard. You can monitor rosters and manage your operator login password below.`}
                        {user?.role === 'school' && `Registered School Portal. ID: ${user.id}. Update rosters, transfer student credentials, and issue certificates.`}
                    </p>
                </div>

                <div className="relative z-10 shrink-0">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-red-100 hover:text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl transition-all shadow-sm"
                    >
                        <LogOut size={14} /> Log Out Account
                    </button>
                </div>
            </div>

            {/* Admin Panel Rows */}
            {user?.role === 'admin' && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                <Building size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Institutions</p>
                                <p className="text-2xl font-black text-gray-900 mt-0.5">
                                    {loadingStats ? "..." : stats.total}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <Landmark size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">K-12 Board Schools</p>
                                <p className="text-2xl font-black text-gray-900 mt-0.5">
                                    {loadingStats ? "..." : stats.schools}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                                <GraduationCap size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Colleges & Universities</p>
                                <p className="text-2xl font-black text-gray-900 mt-0.5">
                                    {loadingStats ? "..." : stats.universities}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Password Resets Box */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                            Pending Password Reset Requests
                        </h3>
                        
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                            {loadingRequests ? (
                                <p className="text-sm font-semibold text-gray-400 text-center py-6">Loading reset requests...</p>
                            ) : requests.length > 0 ? (
                                <div className="space-y-4">
                                    {requests.map((req) => (
                                        <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl gap-4 hover:border-indigo-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                    <Building size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-950">{req.schoolName}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5 font-mono">ID: {req.school_id}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50">
                                                    <Clock size={12} />
                                                    Pending Approval
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleImpersonateAdmin(req.school_id, req.schoolName)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 shadow-sm transition-all"
                                                    >
                                                        <Building size={13} />
                                                        Open Dashboard
                                                    </button>
                                                    <button 
                                                        onClick={() => handleApproveReset(req.id, req.school_id, req.schoolName)}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
                                                    >
                                                        <Key size={13} />
                                                        Approve & Reset
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-sm font-bold text-gray-400 flex flex-col items-center justify-center gap-2">
                                    <CheckCircle size={28} className="text-green-500" />
                                    No pending reset requests. All institutions operational.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* School Admin Rows */}
            {user?.role === 'school-admin' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* View Credentials Box */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                        <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 border-b border-gray-50 pb-4">
                            <Key className="text-indigo-600" size={18} />
                            School Operator Access Credentials
                        </h3>
                        
                        {loadingSchoolPass ? (
                            <p className="text-sm text-gray-400 font-semibold">Fetching credentials...</p>
                        ) : schoolPassInfo ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Operator Login Username</p>
                                        <p className="text-sm font-black text-gray-900 mt-0.5 font-mono">{user.schoolId}</p>
                                    </div>
                                    <div className="border-t border-gray-200/60 pt-3">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current Operator Password</p>
                                        <p className="text-sm font-black text-indigo-600 mt-0.5 font-mono bg-white px-3 py-1.5 rounded-lg border border-indigo-100/50 w-fit">
                                            {schoolPassInfo.password}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                                    Share these credentials with your operators to allow student roster management. Under secure protocol, do not share the administrator A- account passcode.
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-red-500 font-semibold">Failed to fetch credentials.</p>
                        )}
                    </div>

                    {/* Change Credentials Form */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                        <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 border-b border-gray-50 pb-4">
                            <Building className="text-blue-500" size={18} />
                            Reset Operator Password
                        </h3>
                        
                        <form onSubmit={handleSchoolPassUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">New Operator Password</label>
                                <input 
                                    type="text"
                                    value={newSchoolPass}
                                    onChange={(e) => setNewSchoolPass(e.target.value)}
                                    placeholder="Enter new passcode (e.g. dpsPass123)"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={updatingSchoolPass}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs flex items-center gap-1.5"
                            >
                                <Key size={13} />
                                {updatingSchoolPass ? "Updating..." : "Update Passcode"}
                            </button>
                        </form>
                    </div>

                </div>
            )}

            {/* Launchpad Navigation Action Grids */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                    Quick Dashboard Launchpad
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {/* Schools & School Admins have access to roster lookup */}
                    {(user?.role === 'school' || user?.role === 'school-admin') && (
                        <>
                            {/* Card 1 - Only editable by normal school, read-only/link-out for school admin */}
                            <Link to={user.role === 'school' ? "/dashboard/addStudent" : "#"} className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 ${user.role === 'school' ? 'hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed'} transition-all flex flex-col justify-between group h-48 text-left`}>
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-blue-100">
                                    <UserPlus size={24} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-950 mb-1">Register Fresh Student</h3>
                                    <p className="text-gray-400 text-xs leading-normal">Register a new student and generate a life-long Unique ID. (Requires Operator account)</p>
                                </div>
                            </Link>

                            {/* Card 2 - Only editable by normal school */}
                            <Link to={user.role === 'school' ? "/dashboard/enroll" : "#"} className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 ${user.role === 'school' ? 'hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed'} transition-all flex flex-col justify-between group h-48 text-left`}>
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-purple-100">
                                    <ArrowRightLeft size={24} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-950 mb-1">Enroll Transferred Student</h3>
                                    <p className="text-gray-400 text-xs leading-normal">Enroll an existing student who has discharged from another school. (Requires Operator account)</p>
                                </div>
                            </Link>

                            {/* Card 3 - School admin can view roster */}
                            <Link to={user.role === 'school' ? "/dashboard/students" : "/dashboard/students"} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all flex flex-col justify-between group cursor-pointer h-48 text-left">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-green-100">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-950 mb-1">Current Roster</h3>
                                    <p className="text-gray-400 text-xs leading-normal">Manage details, modify paths, and view current timelines.</p>
                                </div>
                            </Link>

                            {/* Card 4 - School admin can search */}
                            <Link to={user.role === 'school' ? "/dashboard/search" : "/dashboard/search"} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all flex flex-col justify-between group cursor-pointer h-48 text-left">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-orange-100">
                                    <Search size={24} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-950 mb-1">Search Database</h3>
                                    <p className="text-gray-400 text-xs leading-normal">Audit any student's global educational history timeline via ID.</p>
                                </div>
                            </Link>
                        </>
                    )}

                    {user?.role === 'admin' && (
                        <>
                            {/* Card 1 */}
                            <Link to="/dashboard/addSchool" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all flex flex-col justify-between group cursor-pointer h-48 text-left">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-indigo-100">
                                    <Building size={24} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-950 mb-1">Register Institution</h3>
                                    <p className="text-gray-400 text-xs leading-normal">Register a new board school or university and set credentials.</p>
                                </div>
                            </Link>
                            
                            {/* Card 2 */}
                            <Link to="/dashboard/schools" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all flex flex-col justify-between group cursor-pointer h-48 text-left">
                                <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-cyan-100">
                                    <Landmark size={24} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-950 mb-1">Listed Directory</h3>
                                    <p className="text-gray-400 text-xs leading-normal">View all authorized schools/universities and adjust passwords.</p>
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
