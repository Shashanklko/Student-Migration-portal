import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, MapPin, Calendar, BookOpen, GraduationCap, ArrowLeft, Building, FileCheck, Edit, Save, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const StudentDetails = () => {
    // Grab the ID from the URL (e.g. /dashboard/student/STU101245)
    const { id } = useParams();
    
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fatherName: '', motherName: '', dob: '', gender: '', address: '', qualification: ''
    });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`/api/student/${id}`);
                setStudent(response.data);
                setEditForm({
                    fatherName: response.data.fatherName || '',
                    motherName: response.data.motherName || '',
                    dob: response.data.dob ? response.data.dob.split('T')[0] : '',
                    gender: response.data.gender || '',
                    address: response.data.address || '',
                    qualification: response.data.qualification || ''
                });
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load student');
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    const handleIssueTC = async () => {
        if(window.confirm(`Are you sure you want to issue a Transfer Certificate for ${student.name}? This will mark their status as Transferred and allow other schools to enroll them.`)) {
            try {
                await axios.post(`/api/student/${student.uniqueId}/transfer`, {
                    lastClass: student.qualification
                });
                setStudent({...student, status: 'Transferred'});
                alert('Transfer Certificate Issued! The student is now released.');
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to issue TC');
            }
        }
    };

    const handleSaveProfile = async () => {
        try {
            await axios.put(`/api/student/${student.uniqueId}`, editForm);
            setStudent({ ...student, ...editForm });
            setIsEditing(false);
            alert('Student Profile Updated Successfully!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update profile');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 font-bold text-gray-500">Loading Student Record...</div>;
    }

    // Handle 404 Not Found
    if (error || !student) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-red-500 font-bold text-xl">Student Not Found</div>
                <p className="text-gray-500">{error || `No student exists with the Unique ID: ${id}`}</p>
                <Link to={user ? "/dashboard" : "/"} className="text-blue-600 hover:underline font-medium">Go back to Safety</Link>
            </div>
        );
    }
    const canEdit = user?.role === 'school' && user?.id === student.currentSchoolId && student.status === 'Active';

    // Return the complete UI
    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in zoom-in duration-300">
            
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <GraduationCap className="text-blue-600" size={28} />
                        Student Profile
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Complete educational journey and details.</p>
                </div>
                <button 
                    onClick={() => navigate(user ? "/dashboard" : "/")}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* ----------------------------- */}
                {/* LEFT COLUMN: CORE INFO        */}
                {/* ----------------------------- */}
                <div className="space-y-6">
                    
                    {/* Primary Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 border-4 border-blue-100">
                            <User size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                        <p className="text-sm font-mono text-gray-500 mt-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                            ID: {student.uniqueId}
                        </p>
                        
                        <div className="mt-4 flex items-center gap-2">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {student.status}
                            </span>
                        </div>
                    </div>

                    {/* Detailed Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                            <h3 className="font-bold text-gray-900">Personal Information</h3>
                            {isEditing && (
                                <button onClick={handleSaveProfile} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md font-bold hover:bg-green-200 flex items-center gap-1">
                                    <Save size={14} /> Save
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Father's Name</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">{student.fatherName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Mother's Name</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">{student.motherName}</p>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <Calendar size={16} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                                        <p className="text-sm font-medium text-gray-900">{student.dob}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Gender</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">{student.gender}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Address</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">{student.address || 'N/A'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Father's Name</p>
                                    <input type="text" value={editForm.fatherName} onChange={e => setEditForm({...editForm, fatherName: e.target.value})} className="w-full text-sm border border-gray-300 rounded px-2 py-1" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Mother's Name</p>
                                    <input type="text" value={editForm.motherName} onChange={e => setEditForm({...editForm, motherName: e.target.value})} className="w-full text-sm border border-gray-300 rounded px-2 py-1" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Date of Birth</p>
                                    <input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} className="w-full text-sm border border-gray-300 rounded px-2 py-1" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Gender</p>
                                    <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full text-sm border border-gray-300 rounded px-2 py-1">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
                                    <textarea value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full text-sm border border-gray-300 rounded px-2 py-1 h-16" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ----------------------------- */}
                {/* RIGHT COLUMN: JOURNEY TIMELINE */}
                {/* ----------------------------- */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Current Status Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-md p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-blue-200 text-sm font-medium mb-1 tracking-wide">CURRENT ENROLLMENT</p>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Building size={20} className="text-blue-200 shrink-0" />
                                {student.currentSchoolName}
                            </h2>
                            <p className="text-blue-200 text-sm mt-2">Level: <span className="font-bold text-white">{student.qualification}</span></p>
                        </div>
                        
                        {/* School Action Panel */}
                        {canEdit && (
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 text-center flex flex-col gap-2">
                                <p className="text-xs text-blue-100 font-bold uppercase tracking-wider">School Actions</p>
                                
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-white/30 w-full"
                                    >
                                        <Edit size={16} />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="bg-red-500/20 text-red-100 hover:bg-red-500/40 px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-red-500/30 w-full"
                                    >
                                        <X size={16} />
                                        Cancel Edit
                                    </button>
                                )}

                                <button 
                                    onClick={handleIssueTC}
                                    className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm w-full"
                                >
                                    <FileCheck size={16} />
                                    Issue Transfer Certificate
                                </button>
                            </div>
                        )}

                        {studentStatus !== 'Active' && (
                            <div className="bg-orange-500/20 p-4 rounded-xl backdrop-blur-sm border border-orange-400/30 text-center">
                                <p className="text-sm text-orange-50 font-bold uppercase tracking-wider">Discharged</p>
                            </div>
                        )}
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-100">
                        <h2 className="text-lg font-bold mb-8 flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-4">
                            <MapPin className="text-blue-600" size={20} />
                            Transfer History Timeline
                        </h2>
                        
                        {/* The Left-Aligned Vertical Timeline */}
                        <div className="space-y-6 pl-2 border-l-2 border-blue-100 ml-4">
                            {student.history.map((record, index) => (
                                <div key={index} className="relative">
                                    {/* The Blue Dot */}
                                    <div className="absolute -left-[27px] top-4 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                                    
                                    {/* The Timeline Content Box */}
                                    <div className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-5 border border-gray-100 shadow-sm ml-6">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                                            <h3 className="font-bold text-gray-900 text-base">{record.schoolName}</h3>
                                            <span className="inline-flex text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full w-fit">
                                                {record.joinedYear} - {record.leftYear}
                                            </span>
                                        </div>
                                        
                                        {/* Show Last Class if it exists */}
                                        {record.lastClass && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Left after completing: <span className="font-semibold text-gray-800 bg-gray-200 px-2 py-0.5 rounded ml-1">{record.lastClass}</span>
                                            </p>
                                        )}
                                        
                                        {/* Highlight if currently studying here */}
                                        {record.leftYear === 'Present' && (
                                            <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                Currently Studying Here
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
