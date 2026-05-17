import React, { useState } from 'react';
import { Search, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchStudent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        if (!searchQuery.trim()) return;

        try {
            // Test if the student exists
            await axios.get(`/api/student/${searchQuery.toUpperCase()}`);
            navigate(`/dashboard/student/${searchQuery.toUpperCase()}`);
        } catch (err) {
            setError(err.response?.data?.error || `No student found with ID: ${searchQuery}`);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 mt-10">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Search Student Database</h1>
                <p className="text-gray-500">Enter a unique Student ID to view their complete educational profile and transfer history.</p>
            </div>

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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap"
                    >
                        Search Profile
                    </button>
                </form>

                {/* Error State */}
                {error && (
                    <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                        <UserX className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="text-sm font-bold text-red-800">Search Failed</h3>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                )}
                
                {/* Helpful Hint for Development */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500 text-center">
                    <p>For testing, try searching for: <span className="font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded">STU101245</span> or <span className="font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded">STU101246</span></p>
                </div>
            </div>
        </div>
    );
};

export default SearchStudent;
