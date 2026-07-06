import React, { useState, useContext } from 'react';
import { UserPlus, Save, User, Phone, BookOpen } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Dynamic dropdown configuration
const ACADEMIC_CONFIG = {
  "Primary (1-5)": {
    courses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Other"],
    branches: ["General", "Other"]
  },
  "Junior (6-8)": {
    courses: ["Class 6", "Class 7", "Class 8", "Other"],
    branches: ["General", "Other"]
  },
  "High School (9-10)": {
    courses: ["Class 9", "Class 10", "Other"],
    branches: ["General", "Other"]
  },
  "Intermediates (11-12)": {
    courses: ["Class 11", "Class 12", "Other"],
    branches: ["PCM (Science)", "PCB (Science)", "Commerce", "Arts", "General", "Other"]
  },
  "Graduation": {
    courses: ["B.Tech (Hons)", "B.Tech", "B.E. (Hons)", "B.E.", "B.Sc (Hons)", "B.Sc", "B.Com (Hons)", "B.Com", "B.A. (Hons)", "B.A.", "BBA", "BCA", "B.E. + M.E. (Dual Degree)", "B.Tech + M.Tech (Dual Degree)", "B.Tech + MBA (Dual Degree)", "Diploma", "Other"],
    branches: ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical", "Civil", "Physics", "Chemistry", "Mathematics", "Finance", "Marketing", "General", "Other"]
  },
  "Post Graduation": {
    courses: ["M.Tech", "M.Sc", "M.Com", "M.A.", "MBA", "MCA", "Other"],
    branches: ["Computer Science", "Finance", "Marketing", "Human Resources", "Data Science", "AI & ML", "General", "Other"]
  },
  "Ph.D": {
    courses: ["Ph.D", "Other"],
    branches: [
      "Computer Science & Engineering",
      "Mechanical Engineering",
      "Electrical & Electronics Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Physics / Physical Sciences",
      "Chemistry / Chemical Sciences",
      "Mathematics & Statistics",
      "Life Sciences & Biotechnology",
      "Humanities & Social Sciences",
      "Management Studies",
      "Economics & Finance",
      "Environmental Sciences",
      "Law & Legal Studies",
      "Medical & Health Sciences",
      "Other"
    ]
  }
};

const AddStudent = () => {
    const { user } = useContext(AuthContext);
    
    // State to hold all form data including new fields
    const [formData, setFormData] = useState({
        studentName: "",
        fatherName: "",
        motherName: "",
        dob: "",
        gender: "Male",
        address: "",
        currentClass: "Class 1",
        courseType: "Primary (1-5)",
        course: "Class 1",
        branch: "General",
        customCourse: "",
        customBranch: "",
        rollNumber: "",
        admissionYear: new Date().getFullYear(),
        graduationYear: new Date().getFullYear() + 5,
        email: "",
        phoneNumber: "",
        bloodGroup: "",
        nationality: "Indian",
        casteCategory: "General"
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "admissionYear") {
            const yearVal = parseInt(value, 10);
            let gradOffset = 1;
            const type = formData.courseType;
            if (type === "Graduation") gradOffset = 4;
            else if (type === "Post Graduation") gradOffset = 2;
            else if (type === "Ph.D") gradOffset = 3;
            else if (type === "Primary (1-5)") gradOffset = 5;
            else if (type === "Junior (6-8)") gradOffset = 3;
            else if (type === "High School (9-10)") gradOffset = 2;
            else if (type === "Intermediates (11-12)") gradOffset = 2;

            setFormData(prev => ({
                ...prev,
                admissionYear: value,
                graduationYear: isNaN(yearVal) ? "" : yearVal + gradOffset
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle course level change
    const handleCourseTypeChange = (e) => {
        const type = e.target.value;
        const config = ACADEMIC_CONFIG[type];
        const defaultCourse = config.courses[0];
        const defaultBranch = config.branches[0];
        
        let gradOffset = 1;
        if (type === "Graduation") gradOffset = 4;
        else if (type === "Post Graduation") gradOffset = 2;
        else if (type === "Ph.D") gradOffset = 3;
        else if (type === "Primary (1-5)") gradOffset = 5;
        else if (type === "Junior (6-8)") gradOffset = 3;
        else if (type === "High School (9-10)") gradOffset = 2;
        else if (type === "Intermediates (11-12)") gradOffset = 2;

        setFormData(prev => ({
            ...prev,
            courseType: type,
            course: defaultCourse,
            branch: defaultBranch,
            customCourse: "",
            customBranch: "",
            currentClass: defaultCourse,
            graduationYear: parseInt(prev.admissionYear, 10) + gradOffset
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const finalCourse = formData.course === "Other" ? formData.customCourse : formData.course;
        const finalBranch = formData.branch === "Other" ? formData.customBranch : formData.branch;

        if (!finalCourse) {
            alert("Please enter a custom Course Name.");
            return;
        }
        if (!finalBranch) {
            alert("Please enter a custom Branch/Stream.");
            return;
        }

        try {
            const response = await axios.post('/api/student', {
                name: formData.studentName,
                fatherName: formData.fatherName,
                motherName: formData.motherName,
                dob: formData.dob,
                gender: formData.gender,
                address: formData.address,
                currentClass: formData.currentClass || finalCourse,
                schoolId: user.id,
                courseType: formData.courseType,
                course: finalCourse,
                branch: finalBranch,
                rollNumber: formData.rollNumber,
                admissionYear: parseInt(formData.admissionYear, 10),
                graduationYear: parseInt(formData.graduationYear, 10),
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                bloodGroup: formData.bloodGroup,
                nationality: formData.nationality,
                casteCategory: formData.casteCategory
            });

            const generatedId = response.data.uniqueId;
            alert(`Student ${formData.studentName} registered successfully!\nUnique ID: ${generatedId}`);
            
            // Reset form after submission
            setFormData({
                studentName: "",
                fatherName: "",
                motherName: "",
                dob: "",
                gender: "Male",
                address: "",
                currentClass: "Class 1",
                courseType: "Primary (1-5)",
                course: "Class 1",
                branch: "General",
                customCourse: "",
                customBranch: "",
                rollNumber: "",
                admissionYear: new Date().getFullYear(),
                graduationYear: new Date().getFullYear() + 5,
                email: "",
                phoneNumber: "",
                bloodGroup: "",
                nationality: "Indian",
                casteCategory: "General"
            });
        } catch (error) {
            alert(error.response?.data?.error || "Failed to add student");
        }
    };

    const currentTypeConfig = ACADEMIC_CONFIG[formData.courseType];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
                    <UserPlus className="text-blue-600" size={26} />
                    Register Fresh Student
                </h1>
                <p className="text-gray-500 text-sm mt-1">Enroll a brand new student into the Eduvera ledger to generate a Unique ID.</p>
            </div>

            {/* The Form Card */}
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. PERSONAL INFORMATION CARD */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-50">
                        <User size={18} className="text-blue-500" />
                        Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student Full Name *</label>
                            <input 
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                                placeholder="e.g. Rahul Sharma"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth *</label>
                            <input 
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Father Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Father's Name *</label>
                            <input 
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                                placeholder="Father's Full Name"
                            />
                        </div>

                        {/* Mother Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mother's Name *</label>
                            <input 
                                type="text"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                                placeholder="Mother's Full Name"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender *</label>
                            <select 
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Blood Group</label>
                            <select 
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            >
                                <option value="">Unknown</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>

                        {/* Nationality */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nationality</label>
                            <input 
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                placeholder="Indian"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Caste Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Caste Category</label>
                            <select 
                                name="casteCategory"
                                value={formData.casteCategory}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            >
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. CONTACT INFORMATION CARD */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-50">
                        <Phone size={18} className="text-indigo-500" />
                        Contact Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                                placeholder="student@example.com"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Number</label>
                            <input 
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>

                        {/* Address - Spans full width */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Residential Address *</label>
                            <textarea 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium resize-none"
                                placeholder="Enter permanent residential address"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* 3. ACADEMIC ENROLLMENT CARD */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-50">
                        <BookOpen size={18} className="text-purple-500" />
                        Academic Enrollment Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Course Level / Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course Level / Type *</label>
                            <select 
                                name="courseType"
                                value={formData.courseType}
                                onChange={handleCourseTypeChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            >
                                <option value="Primary (1-5)">Primary (1-5)</option>
                                <option value="Junior (6-8)">Junior (6-8)</option>
                                <option value="High School (9-10)">High School (9-10)</option>
                                <option value="Intermediates (11-12)">Intermediates (11-12)</option>
                                <option value="Graduation">Graduation</option>
                                <option value="Post Graduation">Post Graduation</option>
                                <option value="Ph.D">Ph.D</option>
                            </select>
                        </div>

                        {/* Course Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course Name *</label>
                            <select 
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            >
                                {currentTypeConfig.courses.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            
                            {/* Custom Course Textbox if 'Other' selected */}
                            {formData.course === "Other" && (
                                <input 
                                    type="text"
                                    name="customCourse"
                                    value={formData.customCourse}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2.5 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                                    placeholder="Enter custom course name (e.g. B.Tech Biotech)"
                                />
                            )}
                        </div>

                        {/* Branch / Stream */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Branch / Stream / Specialisation</label>
                            <select 
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            >
                                {currentTypeConfig.branches.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                            
                            {/* Custom Branch Textbox if 'Other' selected */}
                            {formData.branch === "Other" && (
                                <input 
                                    type="text"
                                    name="customBranch"
                                    value={formData.customBranch}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2.5 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                                    placeholder="Enter custom branch/stream"
                                />
                            )}
                        </div>

                        {/* Registration / Roll Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration / Roll Number *</label>
                            <input 
                                type="text"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                                placeholder="Institutional registration or roll no."
                            />
                        </div>

                        {/* Year of Admission */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year of Admission *</label>
                            <input 
                                type="number"
                                name="admissionYear"
                                value={formData.admissionYear}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Expected Graduation Year */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                {formData.courseType === "Primary (1-5)" && "Expected Primary Completion Year *"}
                                {formData.courseType === "Junior (6-8)" && "Expected Junior School Completion Year *"}
                                {formData.courseType === "High School (9-10)" && "High School Completion Year *"}
                                {formData.courseType === "Intermediates (11-12)" && "Intermediate Completion Year *"}
                                {["Graduation", "Post Graduation", "Ph.D"].includes(formData.courseType) && "Expected Graduation Year *"}
                            </label>
                            <input 
                                type="number"
                                name="graduationYear"
                                value={formData.graduationYear}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Class Identifier */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class / Level Identifier *</label>
                            <input 
                                type="text"
                                name="currentClass"
                                value={formData.currentClass}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
                                placeholder="e.g. 1st Year, 4th Sem, Class XII"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                        <Save size={18} />
                        Register & Generate ID
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddStudent;
