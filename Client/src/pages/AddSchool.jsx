import React, { useState } from 'react';
import { Building, Send, ShieldAlert, Key, Globe, LayoutGrid } from 'lucide-react';
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
            alert(`Successfully registered new institution: ${formData.name} (${formData.schoolId})`);
            setFormData({ schoolId: '', name: '', region: '', password: '' });
        } catch (error) {
            alert(error.response?.data?.error || "Failed to register school");
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-300 space-y-6 text-left">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                        <Building size={24} />
                    </div>
                    Register New Institution
                </h1>
                <p className="text-gray-500 text-sm mt-1">Create an official school or university profile on the Eduvera ledger and generate access credentials.</p>
            </div>

            {/* Form Box */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* School ID */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                <LayoutGrid size={16} className="text-gray-400" />
                                Institution ID *
                            </label>
                            <input 
                                required 
                                type="text"
                                value={formData.schoolId} 
                                onChange={(e) => setFormData({...formData, schoolId: e.target.value.toUpperCase()})}
                                placeholder="e.g. SCH009, UNIV001"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                            />
                            <span className="text-[10px] text-gray-400 font-semibold block">Must be unique (starts with SCH or UNIV).</span>
                        </div>

                        {/* School Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                <Building size={16} className="text-gray-400" />
                                Institution Name *
                            </label>
                            <input 
                                required 
                                type="text"
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Delhi Public School"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Region/District */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                <Globe size={16} className="text-gray-400" />
                                Region / District *
                            </label>
                            <input 
                                required 
                                type="text"
                                value={formData.region} 
                                onChange={(e) => setFormData({...formData, region: e.target.value})}
                                placeholder="e.g. North Zone, Uttar Pradesh"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Initial Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                <Key size={16} className="text-gray-400" />
                                Default Access Password *
                            </label>
                            <input 
                                required 
                                type="text"
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Create temporary passcode"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                    </div>

                    {/* Security Notice */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-xs text-amber-700">
                        <ShieldAlert size={18} className="shrink-0 text-amber-600 mt-0.5" />
                        <div>
                            <p className="font-bold">Credential Security Notice</p>
                            <p className="mt-1 leading-relaxed">
                                Once registered, this institution will be authorized to modify student registries, issue discharge transfer certificates, and access tracking databases. Keep passwords secure.
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4 border-t border-gray-50 flex justify-end">
                        <button 
                            type="submit" 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/25 flex items-center gap-2 text-sm"
                        >
                            <Send size={16} /> 
                            Register Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSchool;
