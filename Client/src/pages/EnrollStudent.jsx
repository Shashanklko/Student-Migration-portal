import React, { useState, useContext } from 'react';
import { Search, UserX, UserCheck, AlertCircle, Send, BookOpen } from 'lucide-react';
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

const EnrollStudent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [student, setStudent] = useState(null);
    const [error, setError] = useState("");
    
    // Academic fields for new enrollment
    const [enrollData, setEnrollData] = useState({
        currentClass: "Class 1", // maps to level/standard label
        courseType: "Primary (1-5)",
        course: "Class 1",
        branch: "General",
        customCourse: "",
        customBranch: "",
        rollNumber: "",
        admissionYear: new Date().getFullYear(),
        graduationYear: new Date().getFullYear() + 5
    });
  
    const { user } = useContext(AuthContext);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(""); 
        setStudent(null);
        setEnrollData({
            currentClass: "Class 1",
            courseType: "Primary (1-5)",
            course: "Class 1",
            branch: "General",
            customCourse: "",
            customBranch: "",
            rollNumber: "",
            admissionYear: new Date().getFullYear(),
            graduationYear: new Date().getFullYear() + 5
        }); 

        if (!searchQuery.trim()) return;

        try {
            const res = await axios.get(`/api/student/${searchQuery.toUpperCase()}`);
            setStudent(res.data);
        } catch (err) {
            setError(err.response?.data?.error || `No student found with ID: ${searchQuery}`);
        }
    };

    // Handle form value changes
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        if (name === "admissionYear") {
            const yearVal = parseInt(value, 10);
            let gradOffset = 1;
            const type = enrollData.courseType;
            if (type === "Graduation") gradOffset = 4;
            else if (type === "Post Graduation") gradOffset = 2;
            else if (type === "Ph.D") gradOffset = 3;
            else if (type === "Primary (1-5)") gradOffset = 5;
            else if (type === "Junior (6-8)") gradOffset = 3;
            else if (type === "High School (9-10)") gradOffset = 2;
            else if (type === "Intermediates (11-12)") gradOffset = 2;

            setEnrollData(prev => ({
                ...prev,
                admissionYear: value,
                graduationYear: isNaN(yearVal) ? "" : yearVal + gradOffset
            }));
        } else {
            setEnrollData(prev => ({
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

        setEnrollData(prev => ({
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

    const handleEnroll = async () => {
        const finalCourse = enrollData.course === "Other" ? enrollData.customCourse : enrollData.course;
        const finalBranch = enrollData.branch === "Other" ? enrollData.customBranch : enrollData.branch;

        if (!finalCourse) {
            alert("Please enter a custom Course Name.");
            return;
        }
        if (!finalBranch) {
            alert("Please enter a custom Branch/Stream.");
            return;
        }
        if (!enrollData.rollNumber) {
            alert("Please enter the registration/roll number.");
            return;
        }
        if (!enrollData.currentClass) {
            alert("Please enter the class level label.");
            return;
        }

        try {
            await axios.post(`/api/student/${student.uniqueId}/enroll`, {
                schoolId: user.id,
                currentClass: enrollData.currentClass,
                courseType: enrollData.courseType,
                course: finalCourse,
                branch: finalBranch,
                rollNumber: enrollData.rollNumber,
                admissionYear: parseInt(enrollData.admissionYear, 10),
                graduationYear: parseInt(enrollData.graduationYear, 10)
            });
            alert(`Successfully Enrolled ${student.name} into ${user?.name || "Your School"}!`);
            setStudent(null);
            setSearchQuery("");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to enroll student");
        }
    };

    const currentTypeConfig = ACADEMIC_CONFIG[enrollData.courseType];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-2 mb-8 text-left">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <BookOpen className="text-blue-600" size={26} />
                    Enroll Transferred Student
                </h1>
                <p className="text-gray-500 text-sm">Search for a student using their Unique ID to enroll them in your institution roster.</p>
            </div>

            {/* Search Box */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Student ID (e.g., RAHUL052010)"
                            className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 outline-none transition-all text-gray-900 font-mono text-base placeholder-gray-400 text-left"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shrink-0"
                    >
                        Find Student
                    </button>
                </form>

                {error && (
                    <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3">
                        <UserX className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div className="text-left">
                            <h3 className="text-sm font-bold text-red-800">Search Failed</h3>
                            <p className="text-xs text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Student Search Result Card */}
            {student && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-400 text-left">
                    
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-gray-50 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 border border-blue-100">
                                <UserCheck size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                                <p className="text-xs font-mono text-gray-400 mt-0.5">ID: {student.uniqueId}</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl max-w-xs">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Last Enrolled Institution</p>
                            <p className="text-xs font-bold text-gray-700">{student.currentSchoolName}</p>
                        </div>
                    </div>

                    {student.status === 'Active' ? (
                        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 space-y-4">
                            <h3 className="font-bold text-red-900 flex items-center gap-2">
                                <AlertCircle size={20} className="text-red-600" />
                                Transfer Certificate Required
                            </h3>
                            <p className="text-xs text-red-700 leading-relaxed">
                                You cannot enroll <strong>{student.name}</strong> because they are currently marked as "Active" at <strong>{student.currentSchoolName}</strong>. 
                                <br/><br/>
                                The previous institution must update the student's status to <span className="font-bold">Transferred</span> or <span className="font-bold">Passed</span> before new enrollment can be processed.
                            </p>
                            
                            <div className="pt-2">
                                <button 
                                    disabled
                                    className="w-full sm:w-auto bg-gray-200 text-gray-400 px-8 py-3 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2 text-xs"
                                >
                                    Enrollment Blocked
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50/50 rounded-2xl p-6 border border-green-200/50 space-y-6">
                            <h3 className="font-bold text-green-900 flex items-center gap-2">
                                <UserCheck size={20} className="text-green-600" />
                                Ready for Enrollment
                            </h3>
                            <p className="text-xs text-green-700 leading-relaxed">
                                This student has been properly discharged from their previous institution and is ready to be enrolled into your roster. Please enter the new academic specifications.
                            </p>
                            
                            {/* Enrollment Fields Form */}
                            <div className="p-6 bg-white rounded-2xl border border-green-100/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Course Level / Type */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Level / Type *</label>
                                    <select 
                                        name="courseType"
                                        value={enrollData.courseType}
                                        onChange={handleCourseTypeChange}
                                        className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                                        required
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Name *</label>
                                    <select 
                                        name="course"
                                        value={enrollData.course}
                                        onChange={handleFieldChange}
                                        className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                                    >
                                        {currentTypeConfig.courses.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    
                                    {/* Custom Course Name if 'Other' selected */}
                                    {enrollData.course === "Other" && (
                                        <input 
                                            type="text"
                                            name="customCourse"
                                            value={enrollData.customCourse}
                                            onChange={handleFieldChange}
                                            placeholder="Enter custom course name"
                                            required
                                            className="w-full mt-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        />
                                    )}
                                </div>

                                {/* Branch / Stream */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Branch / Stream / Specialisation</label>
                                    <select 
                                        name="branch"
                                        value={enrollData.branch}
                                        onChange={handleFieldChange}
                                        className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                                    >
                                        {currentTypeConfig.branches.map((b) => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                    
                                    {/* Custom Branch if 'Other' selected */}
                                    {enrollData.branch === "Other" && (
                                        <input 
                                            type="text"
                                            name="customBranch"
                                            value={enrollData.customBranch}
                                            onChange={handleFieldChange}
                                            placeholder="Enter custom branch"
                                            required
                                            className="w-full mt-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        />
                                    )}
                                </div>

                                {/* Registration / Roll Number */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Registration / Roll Number *</label>
                                    <input 
                                        type="text"
                                        name="rollNumber"
                                        value={enrollData.rollNumber}
                                        onChange={handleFieldChange}
                                        placeholder="New Roll Number"
                                        className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        required
                                    />
                                </div>

                                {/* Year of Admission */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year of Admission *</label>
                                    <input 
                                        type="number"
                                        name="admissionYear"
                                        value={enrollData.admissionYear}
                                        onChange={handleFieldChange}
                                        className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        required
                                    />
                                </div>

                                {/* Expected Graduation */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                        {enrollData.courseType === "Primary (1-5)" && "Expected Primary Completion Year *"}
                                        {enrollData.courseType === "Junior (6-8)" && "Expected Junior Completion Year *"}
                                        {enrollData.courseType === "High School (9-10)" && "High School Completion Year *"}
                                        {enrollData.courseType === "Intermediates (11-12)" && "Intermediate Completion Year *"}
                                        {["Graduation", "Post Graduation", "Ph.D"].includes(enrollData.courseType) && "Expected Graduation Year *"}
                                    </label>
                                    <input 
                                        type="number"
                                        name="graduationYear"
                                        value={enrollData.graduationYear}
                                        onChange={handleFieldChange}
                                        className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        required
                                    />
                                </div>

                                {/* Class / Level Label */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class / Level Label *</label>
                                    <input 
                                        type="text"
                                        name="currentClass"
                                        value={enrollData.currentClass}
                                        onChange={handleFieldChange}
                                        placeholder="e.g. 1st Year, Class XII"
                                        className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    onClick={handleEnroll}
                                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                                >
                                    <Send size={14} />
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

export default EnrollStudent;
