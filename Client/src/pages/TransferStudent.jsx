import React, { useState, useContext } from 'react';
import { Search, UserX, UserCheck, AlertCircle, Send } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TransferStudent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [student, setStudent] = useState(null);
    const [error, setError] = useState("");
    
    // Grab the current logged in school to show who is enrolling them
    const { user } = useContext(AuthContext);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setStudent(null); // Clear previous student

        if (!searchQuery.trim()) return;

        try {
            const res = await axios.get(`/api/student/${searchQuery.toUpperCase()}`);
            setStudent(res.data);
        } catch (err) {
            setError(err.response?.data?.error || `No student found with ID: ${searchQuery}`);
        }
    };

    const handleEnroll = async () => {
        try {
            await axios.post(`/api/student/${student.uniqueId}/enroll`, {
                schoolId: user.id
            });
            alert(`Successfully Enrolled ${student.name} into ${user?.name || "Your School"}!`);
            setStudent(null);
            setSearchQuery("");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to enroll student");
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 mt-10">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Transfer & Enroll Student</h1>
                <p className="text-gray-500">Search for a student using their Unique ID to enroll them into your institution.</p>
            </div>

            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Student ID (e.g., STU101245)"
                            className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap"
                    >
                        Find Student
                    </button>
                </form>

                {error && (
                    <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                        <UserX className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="text-sm font-bold text-red-800">Search Failed</h3>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Search Results & The Business Rule */}
            {student && (
                <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Student Mini Profile */}
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b border-gray-100 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 border-2 border-blue-100">
                                <UserCheck size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                                <p className="text-gray-500 font-mono mt-1">ID: {student.uniqueId}</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl max-w-xs">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Previous/Current School</p>
                            <p className="text-sm font-medium text-gray-900">{student.currentSchoolName}</p>
                        </div>
                    </div>

                    {/* THE BUSINESS RULE IMPLEMENTATION */}
                    {student.status === 'Active' ? (
                        /* BLOCKED STATE */
                        <div className="bg-red-50 rounded-xl p-6 border border-red-200 space-y-4">
                            <h3 className="font-bold text-red-900 flex items-center gap-2">
                                <AlertCircle size={20} className="text-red-600" />
                                Transfer Certificate Required
                            </h3>
                            <p className="text-sm text-red-700 leading-relaxed">
                                You cannot enroll <strong>{student.name}</strong> because they are currently marked as "Active" at <strong>{student.currentSchoolName}</strong>. 
                                <br/><br/>
                                The previous institution must update the student's status to <span className="font-bold">Transferred</span> or <span className="font-bold">Passed</span> before a new enrollment can be processed.
                            </p>
                            
                            <div className="pt-4">
                                <button 
                                    disabled
                                    className="w-full sm:w-auto bg-gray-300 text-gray-500 px-8 py-3 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Enrollment Blocked
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ALLOWED STATE */
                        <div className="bg-green-50 rounded-xl p-6 border border-green-200 space-y-4">
                            <h3 className="font-bold text-green-900 flex items-center gap-2">
                                <UserCheck size={20} className="text-green-600" />
                                Ready for Enrollment
                            </h3>
                            <p className="text-sm text-green-700 leading-relaxed">
                                This student has been properly discharged from their previous institution and is ready to be enrolled into your roster.
                            </p>
                            
                            <div className="pt-4">
                                <button 
                                    onClick={handleEnroll}
                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Send size={18} />
                                    Enroll into {user?.name || "Your School"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TransferStudent;
