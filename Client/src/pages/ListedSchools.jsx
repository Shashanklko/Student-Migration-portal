import React, { useState, useEffect } from 'react';
import { Building2, Search, MapPin, Key } from 'lucide-react';
import axios from 'axios';

const ListedSchools = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="text-center mt-10">Loading schools...</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Building2 size={24} />
                        </div>
                        Listed Schools
                    </h1>
                    <p className="text-gray-500 mt-1">Directory of all institutions registered under the Education Board.</p>
                </div>
                
                {/* Search Box */}
                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search schools by name or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
                                <th className="p-4 pl-6">School Name</th>
                                <th className="p-4">School ID</th>
                                <th className="p-4">Region / District</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSchools.length > 0 ? (
                                filteredSchools.map((school) => (
                                    <tr key={school.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 pl-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-indigo-100">
                                                <span className="font-bold">{school.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{school.name}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-mono text-sm font-bold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1 rounded-md">{school.id}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                                <MapPin size={16} className="text-gray-400" />
                                                {school.region}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <button 
                                                onClick={() => handleResetPassword(school.id, school.name)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-colors"
                                            >
                                                <Key size={14} /> Reset Password
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-gray-500">
                                        No schools found matching your search.
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
