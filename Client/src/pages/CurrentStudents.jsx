import React, { useState, useEffect, useContext } from 'react';
import { Users, Eye } from 'lucide-react';
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

    if (loading) return <div className="text-center mt-10">Loading students...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="text-blue-600" size={28} />
                        Current Students Directory
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and view profiles for all students currently enrolled in your institution.</p>
                </div>
            </div>

            {/* The Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-medium uppercase tracking-wider">
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Unique ID</th>
                                <th className="px-6 py-4">Class / Course</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map((student) => (
                                <tr key={student.uniqueId} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">{student.uniqueId}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                                        {student.qualification}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            student.status === 'Active' 
                                            ? 'bg-green-100 text-green-700' 
                                            : student.status === 'Transferred' 
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            to={`/dashboard/student/${student.uniqueId}`}
                                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <Eye size={16} />
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {/* Empty State fallback just in case */}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No students found in the database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Placeholder */}
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between text-sm text-gray-500">
                    <p>Showing {students.length} students</p>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed">Previous</button>
                        <button disabled className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentStudents;
