import React, { useState } from 'react';
import { Building, Send } from 'lucide-react';
import axios from 'axios';

const AddSchool = () => {
    const [formData, setFormData] = useState({
        schoolId: '',
        name: '',
        region: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/schools', formData);
            alert(`Successfully registered new school: ${formData.name} (${formData.schoolId})`);
            setFormData({ schoolId: '', name: '', region: '', password: '' });
        } catch (error) {
            alert(error.response?.data?.error || "Failed to register school");
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Building size={24} />
                    </div>
                    Register New School
                </h1>
                <p className="text-gray-500 mt-2">Create a new institution account and generate their login credentials.</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">School ID</label>
                            <input 
                                required type="text"
                                value={formData.schoolId} onChange={(e) => setFormData({...formData, schoolId: e.target.value.toUpperCase()})}
                                placeholder="e.g. SCH009"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">School Name</label>
                            <input 
                                required type="text"
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Delhi Public School"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Region/District</label>
                            <input 
                                required type="text"
                                value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}
                                placeholder="e.g. North Zone"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Initial Password</label>
                            <input 
                                required type="text"
                                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Set default password"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2">
                            <Send size={18} /> Register School Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSchool;
