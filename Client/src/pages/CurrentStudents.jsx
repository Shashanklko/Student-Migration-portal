import React, { useState, useEffect, useContext } from 'react';
import { Users, Eye, GraduationCap, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CurrentStudents = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            if (user?.role === 'school') {
                try {
                    const res = await axios.get(`/api/schools/${user.id}/students`);
                    setStudents(res.data);
                } catch (err) {
                    console.error("Failed to fetch students", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchStudents();
    }, [user]);

    if (loading) return <div className="text-center mt-10 text-gray-500 font-bold">Loading student roster...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between text-left">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <Users className="text-blue-600" size={28} />
                        Current Students Directory
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and view profiles for all students currently enrolled in your institution.</p>
                </div>
            </div>

            {/* The Table Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-left">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Unique ID</th>
                                <th className="px-6 py-4">Academic Specifications</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map((student) => (
                                <tr key={student.uniqueId} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 block">{student.name}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">Roll No: {student.rollNumber || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-gray-500 text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">{student.uniqueId}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        <div className="space-y-0.5">
                                            <span className="inline-flex text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-1.5 py-0.5 rounded-md mb-0.5">
                                                {student.courseType || 'School'}
                                            </span>
                                            <p className="text-gray-900 font-bold text-xs sm:text-sm">
                                                {student.course || 'N/A'} {student.branch ? `(${student.branch})` : ''}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                            student.status === 'Active' 
                                            ? 'bg-green-50 text-green-700 border-green-100' 
                                            : student.status === 'Transferred' 
                                                ? 'bg-orange-50 text-orange-700 border-orange-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            to={`/dashboard/student/${student.uniqueId}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-all border border-blue-100/50"
                                        >
                                            <Eye size={14} />
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {/* Empty State fallback */}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                                        <Users className="mx-auto text-gray-300 mb-2" size={36} />
                                        No active students found in this roster.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer Count */}
                <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <p>Total Enrolled: {students.length} students</p>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 border border-gray-200 rounded-lg text-gray-400 bg-white cursor-not-allowed">Previous</button>
                        <button disabled className="px-3 py-1 border border-gray-200 rounded-lg text-gray-400 bg-white cursor-not-allowed">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentStudents;
