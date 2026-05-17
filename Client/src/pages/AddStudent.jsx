import React, { useState, useContext } from 'react';
import { UserPlus, Save } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddStudent = () => {
    const { user } = useContext(AuthContext);
    // State to hold all form data
    const [formData, setFormData] = useState({
        studentName: "",
        fatherName: "",
        motherName: "",
        dob: "",
        gender: "Male",
        address: "",
        currentClass: ""
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Generate a random unique ID (Mock logic for frontend)
            const uniqueId = `STU${Math.floor(100000 + Math.random() * 900000)}`;
            
            await axios.post('/api/student', {
                uniqueId,
                name: formData.studentName,
                fatherName: formData.fatherName,
                motherName: formData.motherName,
                dob: formData.dob,
                gender: formData.gender,
                address: formData.address,
                currentClass: formData.currentClass,
                schoolId: user.id
            });

            alert(`Student ${formData.studentName} registered successfully! Unique ID: ${uniqueId}`);
            
            // Reset form after submission
            setFormData({
                studentName: "",
                fatherName: "",
                motherName: "",
                dob: "",
                gender: "Male",
                address: "",
                currentClass: ""
            });
        } catch (error) {
            alert(error.response?.data?.error || "Failed to add student");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UserPlus className="text-blue-600" />
                    Register Fresh Student
                </h1>
                <p className="text-gray-500 text-sm mt-1">Enroll a brand new student into the education system to generate a Unique ID.</p>
            </div>

            {/* The Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Grid for Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Student Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student Full Name</label>
                            <input 
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. Rahul Sharma"
                            />
                        </div>

                        {/* Father Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                            <input 
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Mother Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                            <input 
                                type="text"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input 
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select 
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Current Class */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Class / Course</label>
                            <input 
                                type="text"
                                name="currentClass"
                                value={formData.currentClass}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Class 1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        
                        {/* Address - Spans full width */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                            <textarea 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                placeholder="Enter full address"
                            ></textarea>
                        </div>

                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button 
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <Save size={18} />
                            Register & Generate ID
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddStudent;
