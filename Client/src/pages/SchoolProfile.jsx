import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Building2, Calendar, Award, Phone, Mail, Globe, MapPin, User, Save, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const SchoolProfile = () => {
    const { user } = useContext(AuthContext);
    
    const [profile, setProfile] = useState({
        id: '',
        name: '',
        region: '',
        establishedYear: '',
        affiliation: '',
        address: '',
        email: '',
        phone: '',
        principalName: '',
        website: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const targetSchoolId = user?.schoolId || user?.id;

    useEffect(() => {
        const fetchSchoolProfile = async () => {
            if (!targetSchoolId) return;
            try {
                const res = await axios.get(`/api/schools/${targetSchoolId}`);
                const data = res.data;
                setProfile({
                    id: data.id || '',
                    name: data.name || '',
                    region: data.region || '',
                    establishedYear: data.establishedYear || '',
                    affiliation: data.affiliation || '',
                    address: data.address || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    principalName: data.principalName || '',
                    website: data.website || ''
                });
            } catch (err) {
                console.error("Failed to load school profile", err);
                setError("Failed to fetch institution profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchSchoolProfile();
    }, [targetSchoolId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');
        try {
            await axios.put(`/api/schools/${targetSchoolId}`, profile);
            setMessage("Institution profile details updated successfully!");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 font-bold text-gray-500">Loading Institution Profile...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in zoom-in duration-300 text-left pb-10">
            
            {/* Header Title */}
            <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                        <Building2 size={24} />
                    </div>
                    Institution Profile Profile
                </h1>
                <p className="text-gray-500 text-sm mt-1">Manage public profile, regional details, certifications, and contact listings.</p>
            </div>

            {/* Notification Alert */}
            {message && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl font-semibold text-sm">
                    {message}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-semibold text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Core Profile Details Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
                    <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 border-b border-gray-50 pb-4">
                        <ShieldCheck className="text-indigo-600" size={18} />
                        Identity & Registry Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* ID (Read-only) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Registry ID</label>
                            <input 
                                type="text"
                                value={profile.id}
                                readOnly
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 font-mono font-bold text-gray-400 cursor-not-allowed text-sm"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Institution Name</label>
                            <input 
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Delhi Public School"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-900"
                            />
                        </div>

                        {/* Region */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Region / Territory</label>
                            <input 
                                type="text"
                                name="region"
                                value={profile.region}
                                onChange={handleChange}
                                required
                                placeholder="e.g. New Delhi, India"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-900"
                            />
                        </div>

                        {/* Estd Year */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Established Year</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Calendar size={16} />
                                </span>
                                <input 
                                    type="number"
                                    name="establishedYear"
                                    value={profile.establishedYear}
                                    onChange={handleChange}
                                    placeholder="e.g. 1995"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Affiliation / Board */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Board / Affiliation Authority</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Award size={16} />
                                </span>
                                <input 
                                    type="text"
                                    name="affiliation"
                                    value={profile.affiliation}
                                    onChange={handleChange}
                                    placeholder="e.g. CBSE, ICSE, UGC, AICTE"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Head Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Head of Institution (Principal / Director / VC)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={16} />
                                </span>
                                <input 
                                    type="text"
                                    name="principalName"
                                    value={profile.principalName}
                                    onChange={handleChange}
                                    placeholder="e.g. Dr. Ramesh Kumar"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-900"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* 2. Contact Listings Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
                    <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 border-b border-gray-50 pb-4">
                        <Phone className="text-blue-500" size={18} />
                        Contact Listings & Address
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Contact Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Phone size={16} />
                                </span>
                                <input 
                                    type="text"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. +91 11 2345 6789"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Institution Email ID</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <input 
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    placeholder="e.g. contact@dps.edu.in"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Website */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Official Website URL</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Globe size={16} />
                                </span>
                                <input 
                                    type="text"
                                    name="website"
                                    value={profile.website}
                                    onChange={handleChange}
                                    placeholder="e.g. https://www.dpsdelhi.edu.in"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Physical Address */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Physical Location Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 top-3.5 pointer-events-none text-gray-400">
                                    <MapPin size={16} />
                                </span>
                                <textarea 
                                    name="address"
                                    rows="3"
                                    value={profile.address}
                                    onChange={handleChange}
                                    placeholder="Enter complete physical address details..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-900"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-750 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 flex items-center gap-2"
                    >
                        <Save size={18} />
                        {saving ? "Saving Profile..." : "Save Profile Details"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default SchoolProfile;
