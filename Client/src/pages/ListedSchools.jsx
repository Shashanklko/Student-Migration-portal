import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, MapPin, Key, GraduationCap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ListedSchools = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const res = await axios.get('/api/schools');
                setSchools(res.data);
            } catch (err) {
                console.error("Failed to fetch schools", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchools();
    }, []);

    const filteredSchools = schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        school.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.region.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleResetPassword = async (schoolId, schoolName) => {
        const newPassword = window.prompt(`Enter new password for ${schoolName} (${schoolId}):`);
        if (newPassword && newPassword.trim() !== '') {
            try {
                await axios.put(`/api/schools/${schoolId}/password`, { password: newPassword });
                alert(`Password for ${schoolId} successfully updated!`);
            } catch (error) {
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

    if (loading) {
        return <div className="flex justify-center items-center h-64 font-bold text-gray-500">Loading Institutions directory...</div>;
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in zoom-in duration-300 text-left">
            
            {/* Header / Search grid */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                            <Building2 size={24} />
                        </div>
                        Listed Institutions
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Directory of all schools and universities registered under the Education Board.</p>
                </div>
                
                {/* Search Box */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search schools or IDs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm focus:border-indigo-500 transition-all text-sm font-semibold"
                    />
                </div>
            </div>

            {/* Registry Card List Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-5 pl-6">Institution Details</th>
                                <th className="p-5">Registry ID</th>
                                <th className="p-5">Region / Location</th>
                                <th className="p-5 text-right pr-8">Dashboard Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSchools.length > 0 ? (
                                filteredSchools.map((school) => {
                                    const isUniv = school.id.startsWith("UNIV") || school.name.toLowerCase().includes("university") || school.name.toLowerCase().includes("college");
                                    return (
                                        <tr key={school.id} className="hover:bg-gray-50/40 transition-colors group">
                                            
                                            {/* Name with character avatar */}
                                            <td className="p-5 pl-6 flex items-center gap-3.5">
                                                <div className={`w-11 h-11 rounded-2xl ${isUniv ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'} flex items-center justify-center shrink-0 shadow-sm font-black`}>
                                                    {isUniv ? <GraduationCap size={20} /> : <Building2 size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-950 group-hover:text-indigo-600 transition-colors">{school.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{isUniv ? 'University / College' : 'K-12 School'}</p>
                                                </div>
                                            </td>

                                            {/* Monospace Registry ID */}
                                            <td className="p-5">
                                                <span className="font-mono text-xs font-black text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">{school.id}</span>
                                            </td>

                                            {/* Region */}
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                                                    <MapPin size={16} className="text-gray-400 shrink-0" />
                                                    {school.region}
                                                </div>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="p-5 text-right pr-8">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleImpersonateAdmin(school.id, school.name)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
                                                    >
                                                        <Building2 size={13} /> 
                                                        Open Admin Dashboard
                                                    </button>
                                                    <button 
                                                        onClick={() => handleResetPassword(school.id, school.name)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 shadow-sm transition-all"
                                                    >
                                                        <Key size={13} /> 
                                                        Reset Passcode
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-16 text-center text-sm font-bold text-gray-400">
                                        No registered institutions match your query.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListedSchools;
