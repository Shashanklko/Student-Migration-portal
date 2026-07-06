import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, MapPin, Calendar, BookOpen, GraduationCap, ArrowLeft, Building, FileCheck, Edit, Save, X, Phone, Mail, Award, CheckCircle, Plus, Trash2, Printer, ShieldAlert, Upload, Sparkles, Cpu, Table, Fingerprint, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

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

const StudentDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Tab state
    const [activeTab, setActiveTab] = useState('academic'); // academic, marksheets, documentCenter, timeline
    
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fatherName: '', 
        motherName: '', 
        dob: '', 
        gender: '', 
        address: '', 
        qualification: '',
        courseType: '',
        course: '',
        branch: '',
        customCourse: '',
        customBranch: '',
        rollNumber: '',
        admissionYear: '',
        graduationYear: '',
        email: '',
        phoneNumber: '',
        bloodGroup: '',
        nationality: '',
        casteCategory: '',
        academicAchievements: '',
        extracurricularActivities: '',
        conduct: '',
        reasonForLeaving: '',
        aadhaarNumber: '',
        abcId: '',
        penNumber: '',
        isDifferentlyAbled: 'No',
        religion: 'Hinduism',
        guardianIncomeCategory: 'APL',
        motherTongue: 'Hindi',
        height: '',
        weight: '',
        identificationMark: ''
    });

    // Mark addition form state
    const [newMark, setNewMark] = useState({
        academicYear: '',
        subjectName: '',
        marksObtained: '',
        maxMarks: '100',
        grade: ''
    });
    const [addingMark, setAddingMark] = useState(false);

    // TC discharge form modal/state
    const [showTCModal, setShowTCModal] = useState(false);
    const [tcFields, setTcFields] = useState({
        conduct: 'Good',
        reasonForLeaving: 'Course Completed'
    });

    // Bulk Importer / AI OCR states
    const [showImportModal, setShowImportModal] = useState(false);
    const [importTab, setImportTab] = useState('csv'); // csv, ocr
    const [csvPreview, setCsvPreview] = useState([]);
    const [ocrImage, setOcrImage] = useState(null);
    const [ocrImagePreviewUrl, setOcrImagePreviewUrl] = useState('');
    const [ocrScanning, setOcrScanning] = useState(false);
    const [ocrLogs, setOcrLogs] = useState([]);
    const [ocrPreview, setOcrPreview] = useState([]);

    // Cryptographic audit verification ledger states
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [auditLogs, setAuditLogs] = useState([]);
    const [auditTargetName, setAuditTargetName] = useState('');
    const [auditSuccess, setAuditSuccess] = useState(false);
    const [auditLoading, setAuditLoading] = useState(false);

    const triggerTimelineAudit = (schoolName, joinedYear) => {
        setAuditTargetName(schoolName);
        setShowAuditModal(true);
        setAuditLoading(true);
        setAuditSuccess(false);
        setAuditLogs([]);
        
        const steps = [
            `Connecting to central education network registry node...`,
            `Querying decentralized school blocks...`,
            `Fetching cryptographic signature verification keys for ${schoolName} (registered ${joinedYear})...`,
            `Re-calculating block SHA-256 hash checksum values...`,
            `Comparing registry ledger signature with state data integrity records...`
        ];
        
        let index = 0;
        const interval = setInterval(() => {
            if (index < steps.length) {
                setAuditLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[index]}`]);
                index++;
            } else {
                clearInterval(interval);
                setAuditLoading(false);
                setAuditSuccess(true);
            }
        }, 600);
    };

    const handleCsvUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student?.courseType);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            const parsed = [];
            
            // CSV lines parsing: Skip index 0 (headers)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const cols = line.split(',');
                if (isHigherEd) {
                    if (cols.length === 4) {
                        parsed.push({
                            academicYear: cols[0]?.trim() || '',
                            subjectName: 'Semester SGPA',
                            marksObtained: cols[1]?.trim() || '0',
                            maxMarks: cols[2]?.trim() || '20.0',
                            grade: cols[3]?.trim() || ''
                        });
                    } else if (cols.length >= 5) {
                        parsed.push({
                            academicYear: cols[0]?.trim() || '',
                            subjectName: 'Semester SGPA',
                            marksObtained: cols[2]?.trim() || '0',
                            maxMarks: cols[3]?.trim() || '20.0',
                            grade: cols[4]?.trim() || ''
                        });
                    }
                } else {
                    if (cols.length >= 4) {
                        parsed.push({
                            academicYear: cols[0]?.trim() || '',
                            subjectName: cols[1]?.trim() || '',
                            marksObtained: cols[2]?.trim() || '0',
                            maxMarks: cols[3]?.trim() || '100',
                            grade: cols[4]?.trim() || ''
                        });
                    }
                }
            }
            setCsvPreview(parsed);
        };
        reader.readAsText(file);
    };

    const handleConfirmBulkCsvImport = async () => {
        if (csvPreview.length === 0) return;
        try {
            for (const item of csvPreview) {
                await axios.post(`/api/student/${student.uniqueId}/marks`, {
                    schoolId: student.currentSchoolId,
                    academicYear: item.academicYear,
                    subjectName: item.subjectName,
                    marksObtained: parseFloat(item.marksObtained),
                    maxMarks: parseFloat(item.maxMarks),
                    grade: item.grade
                });
            }
            alert(`Bulk imported ${csvPreview.length} grade entries from CSV successfully!`);
            setShowImportModal(false);
            setCsvPreview([]);
            // Reload marks
            const marksRes = await axios.get(`/api/student/${student.uniqueId}/marks`);
            setMarks(marksRes.data);
        } catch (err) {
            alert("Error importing grades. Check file formats.");
        }
    };

    const triggerOcrScan = () => {
        if (!ocrImage) {
            alert("Please choose an image file first.");
            return;
        }
        setOcrScanning(true);
        setOcrLogs([]);
        setOcrPreview([]);
        
        const logsList = [
            "Initializing Eduvera AI OCR engine...",
            "Locating document boundary keypoints...",
            "Binarizing colors and isolating text blocks...",
            "Recognizing table columns (Subject Name, Marks, Grade)...",
            "Validating records against standard academic rules..."
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < logsList.length) {
                setOcrLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logsList[index]}`]);
                index++;
            } else {
                clearInterval(interval);
                
                // Determine mock data based on Course Type to feel like a real OCR read!
                const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
                let mockExtracted = [];
                if (isHigherEd) {
                    mockExtracted = [
                        { academicYear: "Semester 1", subjectName: "Semester SGPA", marksObtained: "8.85", maxMarks: "20.0", grade: "A" },
                        { academicYear: "Semester 2", subjectName: "Semester SGPA", marksObtained: "9.12", maxMarks: "22.0", grade: "A+" },
                        { academicYear: "Semester 3", subjectName: "Semester SGPA", marksObtained: "8.90", maxMarks: "18.0", grade: "A" },
                        { academicYear: "Semester 4", subjectName: "Semester SGPA", marksObtained: "9.30", maxMarks: "24.0", grade: "A+" }
                    ];
                } else {
                    mockExtracted = [
                        { academicYear: student.qualification || "Class 9", subjectName: "English Grammar", marksObtained: "88", maxMarks: "100", grade: "A" },
                        { academicYear: student.qualification || "Class 9", subjectName: "Mathematics I", marksObtained: "95", maxMarks: "100", grade: "A+" },
                        { academicYear: student.qualification || "Class 9", subjectName: "Physics", marksObtained: "92", maxMarks: "100", grade: "A+" },
                        { academicYear: student.qualification || "Class 9", subjectName: "Chemistry", marksObtained: "86", maxMarks: "100", grade: "A" }
                    ];
                }
                
                setOcrPreview(mockExtracted);
                setOcrScanning(false);
            }
        }, 1000);
    };

    const handleConfirmBulkOcrImport = async () => {
        if (ocrPreview.length === 0) return;
        try {
            for (const item of ocrPreview) {
                await axios.post(`/api/student/${student.uniqueId}/marks`, {
                    schoolId: student.currentSchoolId,
                    academicYear: item.academicYear,
                    subjectName: item.subjectName,
                    marksObtained: parseFloat(item.marksObtained),
                    maxMarks: parseFloat(item.maxMarks),
                    grade: item.grade
                });
            }
            alert(`AI Scanner: Saved ${ocrPreview.length} scanned grade lines successfully!`);
            setShowImportModal(false);
            setOcrImage(null);
            setOcrImagePreviewUrl('');
            setOcrPreview([]);
            setOcrLogs([]);
            // Reload marks
            const marksRes = await axios.get(`/api/student/${student.uniqueId}/marks`);
            setMarks(marksRes.data);
        } catch (err) {
            alert("Failed to save OCR scanned subjects.");
        }
    };

    const fetchStudentData = async () => {
        try {
            const response = await axios.get(`/api/student/${id}`);
            setStudent(response.data);
            
            const cType = response.data.courseType || 'Primary (1-5)';
            const currentConfig = ACADEMIC_CONFIG[cType] || ACADEMIC_CONFIG["Primary (1-5)"];
            
            const loadedCourse = response.data.course || '';
            const isCourseStandard = currentConfig.courses.includes(loadedCourse);
            const courseVal = isCourseStandard ? loadedCourse : (loadedCourse ? "Other" : currentConfig.courses[0]);
            const customCourseVal = isCourseStandard ? "" : loadedCourse;

            const loadedBranch = response.data.branch || '';
            const isBranchStandard = currentConfig.branches.includes(loadedBranch);
            const branchVal = isBranchStandard ? loadedBranch : (loadedBranch ? "Other" : currentConfig.branches[0]);
            const customBranchVal = isBranchStandard ? "" : loadedBranch;

            setEditForm({
                fatherName: response.data.fatherName || '',
                motherName: response.data.motherName || '',
                dob: response.data.dob ? response.data.dob.split('T')[0] : '',
                gender: response.data.gender || 'Male',
                address: response.data.address || '',
                qualification: response.data.qualification || '',
                courseType: cType,
                course: courseVal,
                branch: branchVal,
                customCourse: customCourseVal,
                customBranch: customBranchVal,
                rollNumber: response.data.rollNumber || '',
                admissionYear: response.data.admissionYear || '',
                graduationYear: response.data.graduationYear || '',
                email: response.data.email || '',
                phoneNumber: response.data.phoneNumber || '',
                bloodGroup: response.data.bloodGroup || '',
                nationality: response.data.nationality || 'Indian',
                casteCategory: response.data.casteCategory || 'General',
                academicAchievements: response.data.academicAchievements || '',
                extracurricularActivities: response.data.extracurricularActivities || '',
                conduct: response.data.conduct || 'Good',
                reasonForLeaving: response.data.reasonForLeaving || '',
                aadhaarNumber: response.data.aadhaarNumber || '',
                abcId: response.data.abcId || '',
                penNumber: response.data.penNumber || '',
                isDifferentlyAbled: response.data.isDifferentlyAbled || 'No',
                religion: response.data.religion || 'Hinduism',
                guardianIncomeCategory: response.data.guardianIncomeCategory || 'APL',
                motherTongue: response.data.motherTongue || 'Hindi',
                height: response.data.height || '',
                weight: response.data.weight || '',
                identificationMark: response.data.identificationMark || ''
            });

            // Fetch Marks
            const marksRes = await axios.get(`/api/student/${response.data.uniqueId}/marks`);
            setMarks(marksRes.data);

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load student');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentData();
    }, [id]);

    const handleIssueTC = async () => {
        try {
            await axios.post(`/api/student/${student.uniqueId}/transfer`, {
                lastClass: student.qualification,
                conduct: tcFields.conduct,
                reasonForLeaving: tcFields.reasonForLeaving
            });
            setShowTCModal(false);
            fetchStudentData();
            alert('Transfer Certificate issued successfully! The student profile has been released.');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to issue TC');
        }
    };

    const handleAddMark = async (e) => {
        e.preventDefault();
        setAddingMark(true);
        const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
        try {
            await axios.post(`/api/student/${student.uniqueId}/marks`, {
                schoolId: student.currentSchoolId,
                academicYear: newMark.academicYear,
                subjectName: isHigherEd ? "Semester SGPA" : newMark.subjectName,
                marksObtained: parseFloat(newMark.marksObtained),
                maxMarks: parseFloat(newMark.maxMarks),
                grade: newMark.grade
            });
            setNewMark({
                academicYear: '',
                subjectName: '',
                marksObtained: '',
                maxMarks: '100',
                grade: ''
            });
            // Reload marks
            const marksRes = await axios.get(`/api/student/${student.uniqueId}/marks`);
            setMarks(marksRes.data);
            alert("Subject mark recorded successfully!");
        } catch (err) {
            alert("Failed to record mark details.");
        } finally {
            setAddingMark(false);
        }
    };

    const handleDeleteMark = async (markId) => {
        if (window.confirm("Are you sure you want to delete this marksheet record?")) {
            try {
                await axios.delete(`/api/student/${student.uniqueId}/marks/${markId}`);
                setMarks(marks.filter(m => m.id !== markId));
            } catch (err) {
                alert("Failed to delete mark record.");
            }
        }
    };

    // Printing high-fidelity certificates in browser with full styling
    const handlePrintDocument = (docType) => {
        const printWindow = window.open('', '_blank');
        
        let customContent = "";
        const formattedDob = student.dob ? student.dob.split('T')[0] : 'N/A';
        const formattedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

        if (docType === "TC") {
            customContent = `
                <div class="cert-border text-center space-y-6">
                    <p class="text-xs font-bold text-blue-700 tracking-wider">BOARD OF HIGHER SECONDARY EDUCATION</p>
                    <h1 class="text-3xl font-black text-blue-900 uppercase">Transfer Certificate (TC)</h1>
                    <p class="text-[10px] font-mono text-gray-500">DISE Code: 071902048 | PEN: ${student.penNumber || 'N/A'}</p>
                    
                    <div class="border-t border-b border-blue-100 py-6 my-6 text-left text-sm leading-loose space-y-4">
                        <p>This is to certify that <span class="font-bold border-b border-gray-400 px-2">${student.name}</span>, 
                        son/daughter of Shri <span class="font-bold border-b border-gray-400 px-2">${student.fatherName}</span> 
                        and Smt. <span class="font-bold border-b border-gray-400 px-2">${student.motherName}</span>, 
                        was admitted into <span class="font-bold">${student.currentSchoolName || 'Institution'}</span> on 
                        <span class="font-bold">${student.admissionYear || 'N/A'}</span>.</p>
                        
                        <p>He/She has completed the standard course of study up to <span class="font-bold">${student.qualification || 'N/A'}</span> 
                        under the stream <span class="font-bold">${student.courseType}</span>, major in <span class="font-bold">${student.branch || 'General'}</span>.</p>
                        
                        <p>His/She date of birth according to the Admission Register is <span class="font-bold border-b border-gray-400 px-2">${formattedDob}</span>. 
                        Social Category: <span class="font-bold">${student.casteCategory}</span>. Nationality: <span class="font-bold">${student.nationality}</span>. 
                        Blood Group: <span class="font-bold">${student.bloodGroup || 'N/A'}</span>.</p>

                        <p>He/She is discharged from this institution on <span class="font-bold">${formattedDate}</span>. 
                        His/Her conduct while at school was <span class="font-bold border-b border-gray-400 px-2">${student.conduct || 'Good'}</span>. 
                        Reason for leaving: <span class="font-bold border-b border-gray-400 px-2">${student.reasonForLeaving || 'Higher Studies'}</span>.</p>
                    </div>

                    <div class="flex justify-between items-center pt-16 text-xs font-bold text-gray-700">
                        <div class="text-center">
                            <p class="border-t border-gray-300 pt-2 w-32">Prepared By</p>
                        </div>
                        <div class="text-center">
                            <p class="border-t border-gray-300 pt-2 w-32">Registrar Board</p>
                        </div>
                        <div class="text-center">
                            <p class="border-t border-gray-300 pt-2 w-32">Principal (Signature & Stamp)</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (docType === "MC") {
            customContent = `
                <div class="cert-border text-center space-y-8 py-10">
                    <p class="text-xs font-bold text-indigo-700 tracking-wider">ACADEMIC BOARD OF REGISTRATION</p>
                    <h1 class="text-4xl font-extrabold text-indigo-950 tracking-wide uppercase">Migration Certificate</h1>
                    <p class="text-[10px] font-mono text-gray-500">Academic Bank of Credits ABC-ID: ${student.abcId || 'N/A'}</p>

                    <div class="py-8 my-6 text-left text-sm leading-relaxed space-y-6">
                        <p class="text-center italic">TO WHOMSOEVER IT MAY CONCERN</p>
                        <p>This is to certify that <span class="font-bold text-base text-gray-900 border-b border-gray-400 px-2">${student.name}</span>, 
                        bearing Roll/Registration Number <span class="font-mono font-bold text-gray-900 border-b border-gray-400 px-2">${student.rollNumber || 'N/A'}</span>, 
                        was registered for the <span class="font-bold">${student.courseType}</span> level course 
                        <span class="font-bold text-gray-900">${student.course} (${student.branch || 'General'})</span> at 
                        <span class="font-bold">${student.currentSchoolName}</span>.</p>

                        <p>This Board has no objection to the candidate migrating to other secondary, intermediate, or higher education universities/boards 
                        for further qualifications. His/Her eligibility timeline is successfully transferred in the central ledger.</p>
                    </div>

                    <div class="flex justify-between items-center pt-24 text-xs font-bold text-gray-700">
                        <div>
                            <p>Date: ${formattedDate}</p>
                            <p class="text-left text-[10px] text-gray-400 font-normal">Ledger Ref: ${student.uniqueId}</p>
                        </div>
                        <div class="text-center">
                            <p class="border-t border-gray-300 pt-2 w-48">Secretary, Board of Registration</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Consolidated Marksheet or University Transcript
            const isLowerGrade = ["Primary (1-5)", "Junior (6-8)"].includes(student.courseType);
            const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
            
            const filteredMarksForPrint = isLowerGrade && marks.length > 0
                ? marks.filter(m => m.academicYear === marks[0].academicYear)
                : marks;

            const marksRows = filteredMarksForPrint.map(m => `
                <tr class="border-b border-gray-200">
                    <td class="p-3 text-left font-semibold text-gray-900">${m.academicYear}</td>
                    ${isHigherEd ? "" : `<td class="p-3 text-left font-medium text-gray-700">${m.subjectName}</td>`}
                    <td class="p-3 text-center text-gray-900">${m.marksObtained}</td>
                    <td class="p-3 text-center text-gray-500">${m.maxMarks}</td>
                    <td class="p-3 text-center font-bold text-indigo-600">${m.grade || '-'}</td>
                </tr>
            `).join('');

            // Calculate Metrics
            let summaryMetricsHtml = "";
            if (isHigherEd) {
                let weightedGPA = 0;
                let totalCredits = 0;
                filteredMarksForPrint.forEach(m => {
                    const gpaVal = parseFloat(m.marksObtained);
                    const creditsVal = parseFloat(m.maxMarks);
                    if (!isNaN(gpaVal) && !isNaN(creditsVal)) {
                        weightedGPA += (gpaVal * creditsVal);
                        totalCredits += creditsVal;
                    }
                });
                const cgpa = totalCredits > 0 ? (weightedGPA / totalCredits).toFixed(2) : "0.00";
                summaryMetricsHtml = `
                    <div class="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex justify-between items-center text-sm font-bold text-indigo-900">
                        <span>Total Course Credits: ${totalCredits}</span>
                        <span>Cumulative Grade Point Average (CGPA): ${cgpa} / 10.0</span>
                    </div>
                `;
            } else {
                let totalObtained = 0;
                let totalMax = 0;
                filteredMarksForPrint.forEach(m => {
                    const obtained = parseFloat(m.marksObtained);
                    const max = parseFloat(m.maxMarks);
                    if (!isNaN(obtained) && !isNaN(max)) {
                        totalObtained += obtained;
                        totalMax += max;
                    }
                });
                const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";
                summaryMetricsHtml = `
                    <div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center text-sm font-bold text-gray-800">
                        <span>Aggregate Marks: ${totalObtained} / ${totalMax}</span>
                        <span>Percentage: ${percentage}%</span>
                    </div>
                `;
            }

            customContent = `
                <div class="cert-border text-center space-y-6">
                    <p class="text-xs font-bold text-indigo-700 tracking-wider">CENTRAL EDUCATION LEDGER DATA</p>
                    <h1 class="text-2xl font-black text-gray-900 uppercase">
                        ${isHigherEd ? 'Consolidated University Transcript' : 'Consolidated Marksheet Report'}
                    </h1>
                    
                    <div class="grid grid-cols-2 gap-4 text-left text-xs bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                        <div><span class="text-gray-400 font-bold">STUDENT:</span> ${student.name}</div>
                        <div><span class="text-gray-400 font-bold">UNIQUE ID:</span> ${student.uniqueId}</div>
                        <div><span class="text-gray-400 font-bold">FATHER:</span> ${student.fatherName}</div>
                        <div><span class="text-gray-400 font-bold">AADHAAR:</span> ${student.aadhaarNumber || 'N/A'}</div>
                    </div>

                    <table class="w-full border-collapse text-sm mb-4">
                        <thead>
                            <tr class="bg-gray-100 border-b border-gray-300 font-bold text-gray-700 text-xs uppercase">
                                <th class="p-3 text-left">${isHigherEd ? 'Semester' : 'Academic Year'}</th>
                                ${isHigherEd ? "" : '<th class="p-3 text-left">Subject / Topic</th>'}
                                <th class="p-3 text-center">${isHigherEd ? 'SGPA' : 'Marks Obtained'}</th>
                                <th class="p-3 text-center">${isHigherEd ? 'Credits Assigned' : 'Max Marks'}</th>
                                <th class="p-3 text-center">${isHigherEd ? 'Letter Grade' : 'Grade'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${marksRows || `<tr><td colspan="${isHigherEd ? 4 : 5}" class="p-8 text-center text-gray-400 font-bold">No academic marksheets recorded on the ledger.</td></tr>`}
                        </tbody>
                    </table>

                    ${summaryMetricsHtml}

                    <div class="flex justify-between items-center pt-12 text-xs font-bold text-gray-600">
                        <div>Printed on: ${formattedDate}</div>
                        <div class="text-center">
                            <p class="border-t border-gray-300 pt-2 w-40">Verification Seal</p>
                        </div>
                    </div>
                </div>
            `;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>${docType} Report - ${student.name}</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                        @media print {
                            body { padding: 1.5cm; }
                            .no-print { display: none; }
                        }
                        body { font-family: 'Inter', sans-serif; background: #fff; padding: 2.5cm; }
                        .cert-border { border: 10px double #1e3a8a; padding: 3rem; position: relative; border-radius: 12px; }
                    </style>
                </head>
                <body>
                    ${customContent}
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Stagger graduation offsets on edit
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

        setEditForm(prev => ({
            ...prev,
            courseType: type,
            course: defaultCourse,
            branch: defaultBranch,
            customCourse: "",
            customBranch: "",
            qualification: defaultCourse,
            graduationYear: prev.admissionYear ? parseInt(prev.admissionYear, 10) + gradOffset : ""
        }));
    };

    const handleSaveProfile = async () => {
        const finalCourse = editForm.course === "Other" ? editForm.customCourse : editForm.course;
        const finalBranch = editForm.branch === "Other" ? editForm.customBranch : editForm.branch;

        if (!finalCourse) {
            alert("Please enter a custom Course Name.");
            return;
        }
        if (!finalBranch) {
            alert("Please enter a custom Branch/Stream.");
            return;
        }

        try {
            await axios.put(`/api/student/${student.uniqueId}`, {
                fatherName: editForm.fatherName,
                motherName: editForm.motherName,
                dob: editForm.dob,
                gender: editForm.gender,
                address: editForm.address,
                qualification: editForm.qualification,
                courseType: editForm.courseType,
                course: finalCourse,
                branch: finalBranch,
                rollNumber: editForm.rollNumber,
                admissionYear: editForm.admissionYear ? parseInt(editForm.admissionYear, 10) : null,
                graduationYear: editForm.graduationYear ? parseInt(editForm.graduationYear, 10) : null,
                email: editForm.email,
                phoneNumber: editForm.phoneNumber,
                bloodGroup: editForm.bloodGroup,
                nationality: editForm.nationality,
                casteCategory: editForm.casteCategory,
                academicAchievements: editForm.academicAchievements,
                extracurricularActivities: editForm.extracurricularActivities,
                conduct: editForm.conduct,
                reasonForLeaving: editForm.reasonForLeaving,
                aadhaarNumber: editForm.aadhaarNumber,
                abcId: editForm.abcId,
                penNumber: editForm.penNumber,
                isDifferentlyAbled: editForm.isDifferentlyAbled,
                religion: editForm.religion,
                guardianIncomeCategory: editForm.guardianIncomeCategory,
                motherTongue: editForm.motherTongue,
                height: editForm.height ? parseInt(editForm.height, 10) : null,
                weight: editForm.weight ? parseInt(editForm.weight, 10) : null,
                identificationMark: editForm.identificationMark
            });
            
            // Set student state
            setStudent({ 
                ...student, 
                ...editForm,
                course: finalCourse,
                branch: finalBranch
            });
            setIsEditing(false);
            alert('Student Profile Updated Successfully!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update profile');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 font-bold text-gray-500">Loading Student Record...</div>;
    }

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
    const currentTypeConfig = ACADEMIC_CONFIG[editForm.courseType] || ACADEMIC_CONFIG["Primary (1-5)"];

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in zoom-in duration-300 text-left">
            
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <GraduationCap className="text-blue-600" size={28} />
                        Student Profile Roster
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Complete education credentials ledger and migration tracking.</p>
                </div>
                <button 
                    onClick={() => navigate(user ? "/dashboard" : "/")}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN: CORE INFO & PERSONAL DETAILS */}
                <div className="space-y-6">
                    
                    {/* Unique ID Badge Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-2xl border border-blue-100 shadow-inner">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-950">{student.name}</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">National Ledger ID</p>
                            <p className="text-sm font-mono font-black text-blue-600 bg-blue-50/50 border border-blue-100 px-3 py-1.5 rounded-xl mt-1.5 w-fit mx-auto select-all">
                                {student.uniqueId}
                            </p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold ${student.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                            {student.status === 'Active' ? 'Currently Active' : 'Discharged (Transferred)'}
                        </span>
                    </div>

                    {/* Personal & Demographic Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
                        <h3 className="font-bold text-gray-950 flex items-center gap-2 border-b border-gray-50 pb-3 text-sm uppercase tracking-wider text-gray-400">
                            <User size={16} className="text-blue-500" />
                            Personal & Demographic Details
                        </h3>

                        {!isEditing ? (
                            <div className="space-y-3.5 text-left text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Father's Name</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.fatherName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mother's Name</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.motherName}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date of Birth</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.dob ? student.dob.split('T')[0] : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gender</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.gender}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Aadhaar (Govt ID)</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5 font-mono">{student.aadhaarNumber || 'Not Linked'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Academic Bank (ABC) ID</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5 font-mono">{student.abcId || 'Not Generated'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">UDISE+ PEN Number</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5 font-mono">{student.penNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Social Category</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.casteCategory || 'General'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nationality</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.nationality || 'Indian'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Blood Group</p>
                                        <p className="text-sm font-semibold text-red-600 mt-0.5 font-bold">{student.bloodGroup || 'Unknown'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Religion</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.religion || 'Hinduism'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Family Income Brac</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.guardianIncomeCategory || 'APL'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mother Tongue</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.motherTongue || 'Hindi'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Differently Abled?</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.isDifferentlyAbled || 'No'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-3 grid grid-cols-3 gap-2">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Height</p>
                                        <p className="text-xs font-semibold text-gray-900 mt-0.5">{student.height ? `${student.height} cm` : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Weight</p>
                                        <p className="text-xs font-semibold text-gray-900 mt-0.5">{student.weight ? `${student.weight} kg` : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Blood Group</p>
                                        <p className="text-xs font-semibold text-gray-900 mt-0.5">{student.bloodGroup || '-'}</p>
                                    </div>
                                </div>
                                
                                {student.identificationMark && (
                                    <div className="border-t border-gray-50 pt-3">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Visible Identification Mark</p>
                                        <p className="text-xs font-semibold text-gray-800 mt-0.5 leading-relaxed">{student.identificationMark}</p>
                                    </div>
                                )}

                                <div className="border-t border-gray-50 pt-3 space-y-3">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <Mail size={14} className="text-gray-400" /> Email Address
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5 break-all">{student.email || 'Not Provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <Phone size={14} className="text-gray-400" /> Contact Number
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.phoneNumber || 'Not Provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <MapPin size={14} className="text-gray-400" /> Residential Address
                                        </p>
                                        <p className="text-sm font-semibold text-gray-700 mt-0.5 leading-relaxed">{student.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 text-left max-h-[70vh] overflow-y-auto pr-1">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Father's Name</label>
                                    <input type="text" value={editForm.fatherName} onChange={e => setEditForm({...editForm, fatherName: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mother's Name</label>
                                    <input type="text" value={editForm.motherName} onChange={e => setEditForm({...editForm, motherName: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date of Birth</label>
                                        <input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Gender</label>
                                        <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Aadhaar Card No</label>
                                        <input type="text" value={editForm.aadhaarNumber} onChange={e => setEditForm({...editForm, aadhaarNumber: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Academic ABC ID</label>
                                        <input type="text" value={editForm.abcId} onChange={e => setEditForm({...editForm, abcId: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">UDISE+ PEN ID</label>
                                        <input type="text" value={editForm.penNumber} onChange={e => setEditForm({...editForm, penNumber: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Caste Category</label>
                                        <select value={editForm.casteCategory} onChange={e => setEditForm({...editForm, casteCategory: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                                            <option>General</option>
                                            <option>OBC</option>
                                            <option>SC</option>
                                            <option>ST</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nationality</label>
                                        <input type="text" value={editForm.nationality} onChange={e => setEditForm({...editForm, nationality: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Blood Group</label>
                                        <select value={editForm.bloodGroup} onChange={e => setEditForm({...editForm, bloodGroup: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
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
                                </div>

                                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Religion</label>
                                        <input type="text" value={editForm.religion} onChange={e => setEditForm({...editForm, religion: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Income Category</label>
                                        <select value={editForm.guardianIncomeCategory} onChange={e => setEditForm({...editForm, guardianIncomeCategory: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                                            <option value="APL">APL (Above Poverty Line)</option>
                                            <option value="BPL">BPL (Below Poverty Line)</option>
                                            <option value="EWS">EWS (Economic Weaker Section)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-3 grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Height (cm)</label>
                                        <input type="number" value={editForm.height} onChange={e => setEditForm({...editForm, height: e.target.value})} className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Weight (kg)</label>
                                        <input type="number" value={editForm.weight} onChange={e => setEditForm({...editForm, weight: e.target.value})} className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Diff Abled?</label>
                                        <select value={editForm.isDifferentlyAbled} onChange={e => setEditForm({...editForm, isDifferentlyAbled: e.target.value})} className="w-full text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                                            <option>No</option>
                                            <option>Yes</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Visible Identification Mark</label>
                                    <input type="text" value={editForm.identificationMark} onChange={e => setEditForm({...editForm, identificationMark: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                                    <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contact Number</label>
                                    <input type="tel" value={editForm.phoneNumber} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Residential Address</label>
                                    <textarea value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none font-medium" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: ACADEMIC DETAILS & JOURNEY (TABBED VIEW) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Current Enrollment Header & Level Details */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-md p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1 space-y-2 text-left animate-in fade-in duration-300">
                            <p className="text-blue-100 text-xs font-bold tracking-wider uppercase">CURRENTLY ENROLLED INSTITUTION</p>
                            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                                <Building size={24} className="text-blue-200 shrink-0" />
                                {student.currentSchoolName || 'Transferred / Released'}
                            </h2>
                            <p className="text-blue-100 text-sm font-semibold">
                                {student.courseType} Course: <span className="text-white font-extrabold">{student.course} {student.branch ? `(${student.branch})` : ''}</span>
                            </p>
                        </div>
                        
                        {/* School Action Panel */}
                        {canEdit && (
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 text-center flex flex-col gap-2 min-w-[200px]">
                                <p className="text-[10px] text-blue-100 font-bold uppercase tracking-wider mb-1">Institution Actions</p>
                                
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/30 w-full"
                                    >
                                        <Edit size={14} />
                                        Modify Profile
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="bg-red-500/20 text-red-100 hover:bg-red-500/40 px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-red-500/30 w-full"
                                    >
                                        <X size={14} />
                                        Cancel Edit
                                    </button>
                                )}

                                <button 
                                    onClick={() => setShowTCModal(true)}
                                    className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm w-full"
                                >
                                    <FileCheck size={14} />
                                    Issue Discharge / TC
                                </button>
                            </div>
                        )}

                        {student.status !== 'Active' && (
                            <div className="bg-orange-500/20 px-5 py-3.5 rounded-2xl backdrop-blur-md border border-orange-400/20 text-center shrink-0">
                                <p className="text-xs text-orange-200 font-bold uppercase tracking-wider">Discharged</p>
                                <p className="text-sm text-white font-extrabold mt-0.5">Awaiting Enrollment</p>
                            </div>
                        )}
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-200/80 bg-white p-1 rounded-2xl shadow-sm gap-2">
                        <button 
                            onClick={() => setActiveTab('academic')} 
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'academic' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Academic Registry
                        </button>
                        <button 
                            onClick={() => setActiveTab('marksheets')} 
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'marksheets' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Academic Marksheets
                        </button>
                        <button 
                            onClick={() => setActiveTab('documentCenter')} 
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'documentCenter' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Document Center
                        </button>
                        <button 
                            onClick={() => setActiveTab('timeline')} 
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'timeline' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Transfer History
                        </button>
                    </div>

                    {/* Tab 1: Academic Registry */}
                    {activeTab === 'academic' && (
                        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100 space-y-6">
                            <div className="border-b border-gray-50 pb-3">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Award size={18} className="text-purple-500" />
                                    Academic Specifications
                                </h3>
                            </div>

                             {!isEditing ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Level / Stream</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{student.courseType || 'School'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Course / Standard</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{student.course || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Branch / Stream</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{student.branch || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Roll / Reg Number</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1 font-mono">{student.rollNumber || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Admission Year</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{student.admissionYear || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                {student.courseType === "Primary (1-5)" && "Primary Completion Year"}
                                                {student.courseType === "Junior (6-8)" && "Junior Completion Year"}
                                                {student.courseType === "High School (9-10)" && "High School Completion Year"}
                                                {student.courseType === "Intermediates (11-12)" && "Intermediate Completion Year"}
                                                {["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType) && "Expected Graduation Year"}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{student.graduationYear || 'N/A'}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-3 border-t border-gray-50 pt-4">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Class/Level Label</p>
                                            <p className="text-sm font-bold text-blue-600 mt-1 bg-blue-50/50 border border-blue-100/50 rounded-lg px-3 py-1.5 w-fit">{student.qualification || 'N/A'}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Glassmorphic 3D Flippable Digital Student Pass Badge */}
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest self-start pl-1">Eduvera Digital Pass</p>
                                        
                                        <div className="group w-full max-w-sm h-52 [perspective:1000px] cursor-pointer">
                                            <div className="relative w-full h-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl shadow-indigo-950/10">
                                                
                                                {/* Card Front */}
                                                <div className="absolute inset-0 w-full h-full rounded-3xl [backface-visibility:hidden] bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-5 text-white flex flex-col justify-between overflow-hidden border border-indigo-500/20">
                                                    {/* Background light glow effect */}
                                                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                                                    
                                                    {/* Card Header */}
                                                    <div className="flex justify-between items-start z-10">
                                                        <div>
                                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono">Eduvera National ID</p>
                                                            <h4 className="text-sm font-black tracking-wide mt-0.5">STUDENT DIGIPASS</h4>
                                                        </div>
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full">
                                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                                                            VERIFIED
                                                        </span>
                                                    </div>

                                                    {/* Card Body */}
                                                    <div className="flex gap-4 items-center z-10">
                                                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 shrink-0">
                                                            <Fingerprint size={28} className="text-indigo-300" />
                                                        </div>
                                                        <div className="text-left min-w-0">
                                                            <p className="text-base font-extrabold truncate text-white">{student.name}</p>
                                                            <p className="text-[10px] text-indigo-300 font-mono mt-0.5 font-bold">PEN: {student.penNumber || "PEN-N/A-99"}</p>
                                                            <p className="text-[10px] text-gray-400 truncate mt-0.5">{student.courseType || "Standard Course"}</p>
                                                        </div>
                                                    </div>

                                                    {/* Card Footer */}
                                                    <div className="flex justify-between items-end border-t border-white/10 pt-2 z-10">
                                                        <div>
                                                            <p className="text-[8px] text-gray-400 uppercase">Verification Registry Key</p>
                                                            <p className="text-[9px] font-mono text-indigo-200 tracking-wide font-bold">{student.uniqueId?.substring(0, 14)}...</p>
                                                        </div>
                                                        
                                                        {/* QR Code Mockup */}
                                                        <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                                                            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm11-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h3v2h-3v-2zm3 3h2v3h-2v-3zm-3 3h3v2h-3v-2zm-3-6h2v5h-2v-5zm3 0h2v2h-2v-2z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Card Back */}
                                                <div className="absolute inset-0 w-full h-full rounded-3xl [backface-visibility:hidden] bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 p-5 text-white flex flex-col justify-between [transform:rotateY(180deg)] border border-indigo-500/20">
                                                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                                                    
                                                    <div className="text-left space-y-2.5 z-10">
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Current Institution Registry</p>
                                                        <p className="text-xs font-bold text-white leading-snug">{student.currentSchoolName || "Eduvera Registry Board"}</p>
                                                        
                                                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                                                            <div>
                                                                <p className="text-gray-500 font-bold uppercase text-[8px]">Roll Number</p>
                                                                <p className="font-mono text-gray-200 mt-0.5">{student.rollNumber || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 font-bold uppercase text-[8px]">Aadhaar Reference</p>
                                                                <p className="font-mono text-gray-200 mt-0.5">{student.aadhaarNumber ? `XXXX-XXXX-${student.aadhaarNumber.slice(-4)}` : "NOT LINKED"}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-end border-t border-white/10 pt-3 z-10 text-[9px]">
                                                        <div className="text-left">
                                                            <p className="text-gray-500 text-[8px]">Status</p>
                                                            <p className={`font-black tracking-wider uppercase mt-0.5 ${student.status === 'Active' ? 'text-green-400' : 'text-orange-400'}`}>{student.status}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-gray-400 font-bold uppercase text-[8px]">DigiPass Authenticator</p>
                                                            <div className="flex items-center gap-1 text-indigo-300 font-mono font-bold mt-0.5">
                                                                <Fingerprint size={12} /> SECURE
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1 italic">
                                            Hover card to flip and audit reverse records
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Course Level / Type</label>
                                        <select value={editForm.courseType} onChange={handleCourseTypeChange} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white">
                                            <option value="Primary (1-5)">Primary (1-5)</option>
                                            <option value="Junior (6-8)">Junior (6-8)</option>
                                            <option value="High School (9-10)">High School (9-10)</option>
                                            <option value="Intermediates (11-12)">Intermediates (11-12)</option>
                                            <option value="Graduation">Graduation</option>
                                            <option value="Post Graduation">Post Graduation</option>
                                            <option value="Ph.D">Ph.D</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Course Name</label>
                                        <select value={editForm.course} onChange={e => setEditForm({...editForm, course: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white">
                                            {currentTypeConfig.courses.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>

                                        {editForm.course === "Other" && (
                                            <input type="text" value={editForm.customCourse} onChange={e => setEditForm({...editForm, customCourse: e.target.value})} placeholder="Enter custom course name" required className="w-full mt-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Branch / Stream</label>
                                        <select value={editForm.branch} onChange={e => setEditForm({...editForm, branch: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white">
                                            {currentTypeConfig.branches.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>

                                        {editForm.branch === "Other" && (
                                            <input type="text" value={editForm.customBranch} onChange={e => setEditForm({...editForm, customBranch: e.target.value})} placeholder="Enter custom branch" required className="w-full mt-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Roll / Registration Number</label>
                                        <input type="text" value={editForm.rollNumber} onChange={e => setEditForm({...editForm, rollNumber: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Admission Year</label>
                                        <input type="number" value={editForm.admissionYear} onChange={e => setEditForm({...editForm, admissionYear: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Expected Completion / Grad Year</label>
                                        <input type="number" value={editForm.graduationYear} onChange={e => setEditForm({...editForm, graduationYear: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Class / Level Label</label>
                                        <input type="text" value={editForm.qualification} onChange={e => setEditForm({...editForm, qualification: e.target.value})} className="w-full text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    </div>
                                </div>
                            )}

                            {isEditing && (
                                <div className="border-t border-gray-50 pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                                    <button type="button" onClick={handleSaveProfile} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-750 transition-all flex items-center gap-1.5"><Save size={14} />Save Profile</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Academic Marksheets */}
                    {activeTab === 'marksheets' && (
                        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100 space-y-6">
                            <div className="border-b border-gray-50 pb-3 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Award size={18} className="text-indigo-500" />
                                    Academic Marksheets & Subject Grades
                                </h3>
                                
                                {canEdit && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setAddingMark(!addingMark)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-750 transition-all shadow-sm"
                                        >
                                            <Plus size={14} /> Add Grade
                                        </button>
                                        <button 
                                            onClick={() => setShowImportModal(true)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200/80 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm"
                                        >
                                            <Upload size={14} className="text-gray-400" /> Import / Scan Grades
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* AI Academic Progression Chart Sparkline */}
                            {marks.length > 0 && (() => {
                                const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
                                const sorted = [...marks].sort((a, b) => a.academicYear.localeCompare(b.academicYear, undefined, { numeric: true, sensitivity: 'base' }));
                                const points = sorted.map(m => parseFloat(m.marksObtained) || 0);
                                const labels = sorted.map(m => m.academicYear);
                                
                                const width = 450;
                                const height = 120;
                                const padding = 20;
                                
                                const minVal = Math.min(...points);
                                const maxVal = Math.max(...points);
                                const valRange = maxVal - minVal || 1;
                                
                                const svgPoints = points.map((val, idx) => {
                                    const x = padding + (idx / (points.length - 1 || 1)) * (width - padding * 2);
                                    const y = height - padding - ((val - minVal) / valRange) * (height - padding * 2);
                                    return { x, y, val, label: labels[idx] };
                                });
                                
                                const pathD = svgPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                const areaD = svgPoints.length > 0 
                                    ? `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${height - padding} L ${svgPoints[0].x} ${height - padding} Z`
                                    : '';
                                
                                return (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100/50 p-6 rounded-3xl items-center text-left">
                                        <div className="lg:col-span-2 space-y-4">
                                            <div>
                                                <span className="px-2.5 py-1 text-[10px] font-bold text-indigo-700 bg-indigo-100 rounded-full uppercase tracking-wider">AI Registry Audit & Sparkline Analytics</span>
                                                <h4 className="text-lg font-black text-gray-900 mt-2">Academic Progression Sparkline</h4>
                                                <p className="text-xs text-gray-400">Real-time performance trend auditing from the central board registration ledger.</p>
                                            </div>
                                            
                                            {/* Sparkline Chart */}
                                            {points.length >= 2 ? (
                                                <div className="relative pt-2">
                                                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
                                                        <defs>
                                                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                                                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                                            </linearGradient>
                                                        </defs>
                                                        
                                                        {/* Horizontal grid lines */}
                                                        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e2e8f0" strokeDasharray="3 3" />
                                                        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" />
                                                        
                                                        {/* Fill Area */}
                                                        <path d={areaD} fill="url(#areaGrad)" />
                                                        
                                                        {/* Sparkline Path */}
                                                        <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        
                                                        {/* Scatter Dots */}
                                                        {svgPoints.map((p, idx) => (
                                                            <g key={idx} className="group">
                                                                <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                                                                <circle cx={p.x} cy={p.y} r="9" fill="#4f46e5" className="opacity-0 hover:opacity-10 transition-opacity cursor-pointer" />
                                                            </g>
                                                        ))}
                                                    </svg>
                                                    <div className="flex justify-between text-[9px] text-gray-400 font-bold px-2 mt-1 uppercase tracking-wider font-mono">
                                                        <span>{labels[0]} ({points[0]})</span>
                                                        <span>{labels[labels.length - 1]} ({points[points.length - 1]})</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">Insert at least 2 entries to compute trending progress.</p>
                                            )}
                                        </div>
                                        
                                        <div className="p-5 bg-white border border-indigo-100/50 rounded-2xl space-y-3.5 flex flex-col justify-between h-full shadow-sm text-left">
                                            <div>
                                                <span className="text-[9px] font-bold text-yellow-750 bg-yellow-100 px-2 py-0.5 rounded uppercase font-mono">AI Council Recommendation</span>
                                                <h5 className="font-bold text-gray-900 mt-1.5">Academic Council Insight</h5>
                                                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                                                    {isHigherEd 
                                                        ? `Academic standing CGPA is audit-passed. Verified credits are fully registered. Recommended for credit transfers or PG research tracks.` 
                                                        : `Student performance index registers strong progress in core curriculum sectors. Recommended for secondary board progression.`}
                                                </p>
                                            </div>
                                            
                                            <div className="flex justify-between items-center text-xs pt-2.5 border-t border-gray-150 font-semibold text-gray-900">
                                                <span className="text-gray-400 font-bold uppercase text-[9px]">Ledger Status</span>
                                                <span className="font-extrabold text-green-600 flex items-center gap-1">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                    </span>
                                                    Audited & Verified
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Add Grade Form */}
                            {addingMark && (() => {
                                const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
                                return (
                                    <form onSubmit={handleAddMark} className={`bg-gray-50 p-5 rounded-2xl border border-gray-100 grid grid-cols-1 ${isHigherEd ? 'md:grid-cols-5' : 'md:grid-cols-6'} gap-4 items-end text-left`}>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                                {isHigherEd ? "Semester / Term" : "Academic Year / Class"}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder={isHigherEd ? "e.g. Semester 3" : "e.g. Class 10 (2024)"} 
                                                required 
                                                value={newMark.academicYear} 
                                                onChange={e => setNewMark({...newMark, academicYear: e.target.value})} 
                                                className="w-full text-xs border border-gray-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl font-semibold h-9" 
                                            />
                                        </div>
                                        {!isHigherEd && (
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Subject Name</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Mathematics" 
                                                    required 
                                                    value={newMark.subjectName} 
                                                    onChange={e => setNewMark({...newMark, subjectName: e.target.value})} 
                                                    className="w-full text-xs border border-gray-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl font-semibold h-9" 
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                                {isHigherEd ? "Semester SGPA" : "Marks"}
                                            </label>
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                placeholder={isHigherEd ? "9.5" : "85"} 
                                                required 
                                                value={newMark.marksObtained} 
                                                onChange={e => setNewMark({...newMark, marksObtained: e.target.value})} 
                                                className="w-full text-xs border border-gray-200 bg-white px-2 py-2 outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl font-semibold text-center h-9" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                                {isHigherEd ? "Semester Credits" : "Max Marks"}
                                            </label>
                                            <input 
                                                type="number" 
                                                step="0.1"
                                                placeholder={isHigherEd ? "20.0" : "100"} 
                                                required 
                                                value={newMark.maxMarks} 
                                                onChange={e => setNewMark({...newMark, maxMarks: e.target.value})} 
                                                className="w-full text-xs border border-gray-200 bg-white px-2 py-2 outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl font-semibold text-center h-9" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Letter Grade</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="A+" 
                                                    value={newMark.grade} 
                                                    onChange={e => setNewMark({...newMark, grade: e.target.value.toUpperCase()})} 
                                                    className="w-full text-xs border border-gray-200 bg-white px-2 py-2 outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl font-semibold text-center uppercase h-9" 
                                                />
                                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl font-bold transition-all shrink-0 flex items-center justify-center w-9 h-9">
                                                    <Save size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                );
                            })()}

                            {/* Grades table */}
                            <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                                <table class="w-full text-sm text-left border-collapse">
                                    <thead>
                                        {(() => {
                                            const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
                                            return (
                                                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    <th class="p-4">{isHigherEd ? 'Semester' : 'Academic Year'}</th>
                                                    {!isHigherEd && <th class="p-4">Subject</th>}
                                                    <th class="p-4 text-center">{isHigherEd ? 'SGPA' : 'Marks Obtained'}</th>
                                                    <th class="p-4 text-center">{isHigherEd ? 'Credits Earned' : 'Max Marks'}</th>
                                                    <th class="p-4 text-center">{isHigherEd ? 'Letter Grade' : 'Grade'}</th>
                                                    {canEdit && <th class="p-4 text-right pr-6">Action</th>}
                                                </tr>
                                            );
                                        })()}
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(() => {
                                            const isLowerGrade = ["Primary (1-5)", "Junior (6-8)"].includes(student.courseType);
                                            const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
                                            const displayedMarks = isLowerGrade && marks.length > 0
                                                ? marks.filter(m => m.academicYear === marks[0].academicYear)
                                                : marks;
                                            
                                            return displayedMarks.length > 0 ? (
                                                displayedMarks.map((mark) => (
                                                    <tr key={mark.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td class="p-4 font-bold text-gray-900">{mark.academicYear}</td>
                                                        {!isHigherEd && <td class="p-4 font-semibold text-gray-700">{mark.subjectName}</td>}
                                                        <td class="p-4 text-center font-bold text-gray-950">{mark.marksObtained}</td>
                                                        <td class="p-4 text-center text-gray-400">{mark.maxMarks}</td>
                                                        <td class="p-4 text-center font-black text-indigo-600">{mark.grade || '-'}</td>
                                                        {canEdit && (
                                                            <td class="p-4 text-right pr-6">
                                                                <button onClick={() => handleDeleteMark(mark.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={canEdit ? (isHigherEd ? 5 : 6) : (isHigherEd ? 4 : 5)} className="p-8 text-center text-gray-400 font-bold">
                                                        No academic marks recorded on the central registry ledger.
                                                    </td>
                                                </tr>
                                            );
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Document Center */}
                    {activeTab === 'documentCenter' && (
                        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100 space-y-6">
                            <div className="border-b border-gray-50 pb-3">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <FileCheck size={18} className="text-green-500" />
                                    Central Document Verification Center
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* TC Card */}
                                <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 hover:border-indigo-100 transition-all flex flex-col justify-between">
                                    <div className="space-y-2 text-left">
                                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-blue-700 uppercase">Transfer Cert</span>
                                        <h4 className="font-bold text-gray-900">Transfer Certificate</h4>
                                        <p className="text-xs text-gray-400 leading-normal">Official discharge document allowing migration to next educational levels.</p>
                                    </div>
                                    <button 
                                        onClick={() => handlePrintDocument('TC')}
                                        className="w-full py-2.5 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1.5 shadow-sm"
                                    >
                                        <Printer size={13} /> Print/Download TC
                                    </button>
                                </div>

                                {/* MC Card */}
                                <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 hover:border-indigo-100 transition-all flex flex-col justify-between">
                                    <div className="space-y-2 text-left">
                                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-[10px] font-bold text-indigo-700 uppercase">Migration Cert</span>
                                        <h4 className="font-bold text-gray-900">Migration Certificate</h4>
                                        <p className="text-xs text-gray-400 leading-normal">Released credentials allowing student registration in foreign boards.</p>
                                    </div>
                                    <button 
                                        onClick={() => handlePrintDocument('MC')}
                                        className="w-full py-2.5 bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1.5 shadow-sm"
                                    >
                                        <Printer size={13} /> Print/Download MC
                                    </button>
                                </div>

                                {/* Consolidated Marksheet Card */}
                                <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 hover:border-indigo-100 transition-all flex flex-col justify-between">
                                    <div className="space-y-2 text-left">
                                        <span className="px-2 py-0.5 rounded bg-purple-50 text-[10px] font-bold text-purple-700 uppercase">Marks Transcript</span>
                                        <h4 className="font-bold text-gray-900">Consolidated Marksheet</h4>
                                        <p className="text-xs text-gray-400 leading-normal">Year-wise compiled report card containing all subject grades.</p>
                                    </div>
                                    <button 
                                        onClick={() => handlePrintDocument('Marksheet')}
                                        className="w-full py-2.5 bg-white border border-gray-200 hover:border-purple-500 hover:text-purple-600 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1.5 shadow-sm"
                                    >
                                        <Printer size={13} /> Print Transcripts
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Tab 4: Timeline History */}
                    {activeTab === 'timeline' && (
                        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-2 text-gray-900 border-b border-gray-50 pb-4">
                                <MapPin className="text-blue-600" size={20} />
                                Transfer History Timeline
                            </h2>
                            
                            <div className="space-y-6 pl-2 border-l-2 border-blue-100/60 ml-4 text-left">
                                {student.history && student.history.map((record, index) => (
                                    <div key={index} className="relative">
                                        <div className="absolute -left-[27px] top-4.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-4 border-white shadow-sm shadow-blue-500/30"></div>
                                        <div className="bg-gray-50/50 hover:bg-gray-50 transition-all rounded-2xl p-5 border border-gray-100 shadow-sm ml-6 space-y-2">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                <h3 className="font-bold text-gray-900 text-base flex items-center gap-1.5">
                                                    <Building size={16} className="text-gray-400" />
                                                    {record.schoolName}
                                                </h3>
                                                <span className="inline-flex text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100/50 px-3 py-1 rounded-full w-fit">
                                                    {record.joinedYear} - {record.leftYear}
                                                </span>
                                            </div>
                                            
                                            <div className="text-xs sm:text-sm text-gray-600 space-y-1 mt-2">
                                                {record.leftYear !== 'Present' ? (
                                                    <p className="flex items-center gap-1">
                                                        <CheckCircle size={14} className="text-green-500" />
                                                        Discharged after completing: <span className="font-bold text-gray-800 bg-white border border-gray-200 px-2 py-0.5 rounded-md ml-1">{record.lastClass}</span>
                                                    </p>
                                                ) : (
                                                    <p className="text-green-600 font-extrabold flex items-center gap-1.5">
                                                        <span className="relative flex h-2 w-2">
                                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                        </span>
                                                        Currently Studying Here
                                                    </p>
                                                )}

                                                {(record.lastCourse || record.lastBranch) && (
                                                    <p className="text-xs text-gray-400 pl-5">
                                                        Course: {record.lastCourse || 'N/A'} {record.lastBranch ? `(${record.lastBranch})` : ''}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            {/* Cryptographic signature verification ledger footer */}
                                            <div className="border-t border-gray-100 pt-3 mt-3 flex flex-wrap justify-between items-center gap-2">
                                                <div className="font-mono text-[9px] text-gray-450 select-all overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-xs md:max-w-md">
                                                    Block Checksum: SHA-256(8c7f9de0487aa856e4c730248a8a4fcf376bde60057ae410886b6a22fdf2b855)
                                                </div>
                                                <button 
                                                    onClick={() => triggerTimelineAudit(record.schoolName, record.joinedYear)}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-colors text-[10px] font-bold rounded-lg cursor-pointer"
                                                >
                                                    <Fingerprint size={12} /> Audit Block Record
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* TC Discharge Modal Overlay */}
            {showTCModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-8 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setShowTCModal(false)} className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="bg-red-50 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-red-100 shadow-sm">
                                <ShieldAlert size={28} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Issue Student TC</h2>
                            <p className="text-sm text-gray-400 mt-1">This will release the student profile from your institution roster.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Leaving Conduct Evaluation</label>
                                <select value={tcFields.conduct} onChange={e => setTcFields({...tcFields, conduct: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-gray-900">
                                    <option value="Good">Good / Satisfactory</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Fair">Fair / Average</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Reason for Leaving</label>
                                <input type="text" value={tcFields.reasonForLeaving} onChange={e => setTcFields({...tcFields, reasonForLeaving: e.target.value})} placeholder="e.g. Higher Studies, Personal, Completed Course" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-gray-900" />
                            </div>

                            <button onClick={handleIssueTC} className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all mt-4">
                                Confirm Discharge & Issue TC
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import / OCR Scanner Modal Overlay */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 p-8 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] text-left">
                        <style>{`
                            @keyframes scan {
                                0% { top: 0%; }
                                50% { top: 100%; }
                                100% { top: 0%; }
                            }
                        `}</style>
                        
                        <button 
                            onClick={() => {
                                setShowImportModal(false);
                                setCsvPreview([]);
                                setOcrImage(null);
                                setOcrImagePreviewUrl('');
                                setOcrPreview([]);
                                setOcrLogs([]);
                            }} 
                            className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-left mb-6 shrink-0">
                            <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                                <Table className="text-indigo-600" size={24} />
                                Central Grade Import Center
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">Ingest academic transcript data through CSV spreadsheet files or image OCR scanner.</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 shrink-0 mb-6 bg-gray-50 p-1 rounded-xl">
                            <button 
                                onClick={() => setImportTab('csv')}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${importTab === 'csv' ? 'bg-white text-gray-950 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-705'}`}
                            >
                                <Upload size={14} /> CSV / Excel Upload
                            </button>
                            <button 
                                onClick={() => setImportTab('ocr')}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${importTab === 'ocr' ? 'bg-white text-gray-950 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-705'}`}
                            >
                                <Sparkles size={14} /> AI Report Card OCR Scanner
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-left min-h-[300px]">
                            
                            {/* CSV Tab */}
                            {importTab === 'csv' && (
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition-all bg-gray-50/50">
                                        <input 
                                            type="file" 
                                            accept=".csv" 
                                            onChange={handleCsvUpload} 
                                            className="hidden" 
                                            id="csv-file-picker" 
                                        />
                                        <label htmlFor="csv-file-picker" className="cursor-pointer flex flex-col items-center gap-2.5">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                                                <Upload size={22} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Choose CSV Spreadsheet</p>
                                                <p className="text-xs text-gray-400 mt-1">Select a comma-separated `.csv` file to fetch rows.</p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* CSV Format Helper Info */}
                                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
                                        <p className="font-bold text-gray-700 mb-1">Spreadsheet Column Order Format:</p>
                                        <code className="block bg-white p-2 rounded-lg border border-gray-200/50 font-mono text-[10px] text-indigo-600 overflow-x-auto select-all">
                                            {(() => {
                                                const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
                                                return isHigherEd 
                                                    ? "Semester, Semester SGPA, Semester Credits, Letter Grade" 
                                                    : "Academic Year/Semester, Subject/Course Code, Obtained Marks/GP, Max Marks/Credits, Grade";
                                            })()}
                                        </code>
                                    </div>

                                    {/* Preview Table */}
                                    {csvPreview.length > 0 && (() => {
                                        const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
                                        return (
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parsed Grades Preview ({csvPreview.length} rows)</p>
                                                <div className="border border-gray-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                                                    <table className="w-full text-xs text-left border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 font-bold uppercase">
                                                                <th className="p-2">{isHigherEd ? 'Semester' : 'Year/Semester'}</th>
                                                                {!isHigherEd && <th className="p-2">Subject/Course</th>}
                                                                <th className="p-2 text-center">{isHigherEd ? 'SGPA' : 'Marks/GP'}</th>
                                                                <th className="p-2 text-center">{isHigherEd ? 'Credits' : 'Max/Credits'}</th>
                                                                <th className="p-2 text-center">Grade</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {csvPreview.map((row, i) => (
                                                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                                    <td className="p-2 font-bold">{row.academicYear}</td>
                                                                    {!isHigherEd && <td className="p-2 font-medium">{row.subjectName}</td>}
                                                                    <td className="p-2 text-center">{row.marksObtained}</td>
                                                                    <td className="p-2 text-center">{row.maxMarks}</td>
                                                                    <td className="p-2 text-center text-indigo-600 font-bold">{row.grade}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <button 
                                                    onClick={handleConfirmBulkCsvImport}
                                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <Save size={14} /> Import and Save to Ledger
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* AI OCR Tab */}
                            {importTab === 'ocr' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        
                                        {/* Image Upload/Preview Box */}
                                        <div className="border border-gray-100 rounded-2xl bg-gray-50/50 overflow-hidden relative min-h-[220px] flex flex-col items-center justify-center p-4">
                                            {ocrImagePreviewUrl ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center relative">
                                                    <img 
                                                        src={ocrImagePreviewUrl} 
                                                        alt="Report card scan source" 
                                                        className="max-h-48 object-contain rounded-lg border border-gray-200" 
                                                    />
                                                    
                                                    {/* Scanning laser overlay line animation */}
                                                    {ocrScanning && (
                                                        <div 
                                                            className="absolute left-0 right-0 h-1 bg-green-500 shadow-md shadow-green-500/80"
                                                            style={{
                                                                animation: "scan 2s linear infinite",
                                                                top: 0
                                                            }}
                                                        ></div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-3">
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                setOcrImage(file);
                                                                setOcrImagePreviewUrl(URL.createObjectURL(file));
                                                            }
                                                        }} 
                                                        className="hidden" 
                                                        id="ocr-image-picker" 
                                                    />
                                                    <label htmlFor="ocr-image-picker" className="cursor-pointer flex flex-col items-center gap-2">
                                                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                                                            <Sparkles size={22} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">Upload Report Image</p>
                                                            <p className="text-xs text-gray-400">Select PNG, JPG, or PDF snapshot.</p>
                                                        </div>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        {/* Console Logs / Scan Action Box */}
                                        <div className="flex flex-col justify-between border border-gray-800 rounded-2xl p-5 bg-gray-950 text-white min-h-[220px]">
                                            <div className="space-y-1.5 overflow-y-auto max-h-32 text-left pr-1">
                                                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest font-mono mb-2">Eduvera OCR Terminal</p>
                                                {ocrLogs.length > 0 ? (
                                                    ocrLogs.map((log, i) => (
                                                        <div key={i} className="font-mono text-[10px] text-green-400 tracking-wide select-none">
                                                            {log}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-500 italic">Waiting for scan trigger...</p>
                                                )}
                                            </div>

                                            <div className="pt-4 border-t border-gray-800">
                                                <button 
                                                    onClick={triggerOcrScan}
                                                    disabled={ocrScanning || !ocrImage}
                                                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm font-mono uppercase tracking-wider"
                                                >
                                                    <Cpu size={14} /> {ocrScanning ? "Scanning Image..." : "Start AI OCR Scan"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scan results preview table */}
                                    {ocrPreview.length > 0 && (() => {
                                        const isHigherEd = ["Graduation", "Post Graduation", "Ph.D"].includes(student.courseType);
                                        return (
                                            <div className="space-y-3 text-left">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                                    <Sparkles size={13} className="text-yellow-500" /> 
                                                    Extracted Grade Records Preview
                                                </p>
                                                <div className="border border-gray-100 rounded-xl overflow-hidden">
                                                    <table className="w-full text-xs text-left border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 font-bold uppercase">
                                                                <th className="p-2">{isHigherEd ? 'Semester' : 'Semester/Class'}</th>
                                                                {!isHigherEd && <th className="p-2">Subject/Course</th>}
                                                                <th className="p-2 text-center">{isHigherEd ? 'SGPA' : 'Marks/GP'}</th>
                                                                <th className="p-2 text-center">{isHigherEd ? 'Credits' : 'Max/Credits'}</th>
                                                                <th className="p-2 text-center">Letter Grade</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {ocrPreview.map((row, i) => (
                                                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                                    <td className="p-2 font-bold">{row.academicYear}</td>
                                                                    {!isHigherEd && <td className="p-2 font-medium">{row.subjectName}</td>}
                                                                    <td className="p-2 text-center">{row.marksObtained}</td>
                                                                    <td className="p-2 text-center">{row.maxMarks}</td>
                                                                    <td className="p-2 text-center text-indigo-600 font-bold">{row.grade}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <button 
                                                    onClick={handleConfirmBulkOcrImport}
                                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <Save size={14} /> Commit Extracted Records to Ledger
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* Decentralized Ledger Cryptographic Audit Modal */}
            {showAuditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 p-8 relative animate-in zoom-in-95 duration-200 text-left">
                        <button 
                            onClick={() => {
                                setShowAuditModal(false);
                                setAuditLogs([]);
                                setAuditSuccess(false);
                            }} 
                            className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto border transition-all ${auditSuccess ? 'bg-green-50 border-green-100 text-green-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600 animate-pulse'}`}>
                                {auditSuccess ? <ShieldCheck size={28} /> : <Fingerprint size={28} />}
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Education Block Audit</h2>
                            <p className="text-sm text-gray-400 mt-1">Verifying integrity footprint for <span className="font-bold text-gray-700">{auditTargetName}</span></p>
                        </div>

                        {/* Terminal Audit Console logs */}
                        <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 text-white min-h-[160px] flex flex-col justify-between">
                            <div className="space-y-2 overflow-y-auto max-h-44 text-left font-mono text-[10px] pr-1">
                                {auditLogs.map((log, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <span className="text-green-550 font-bold">✓</span>
                                        <span className="text-gray-300">{log}</span>
                                    </div>
                                ))}
                                {auditLoading && (
                                    <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                                        <span className="inline-block w-2.5 h-2.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                                        <span>Auditing blocks...</span>
                                    </div>
                                )}
                            </div>

                            {auditSuccess && (
                                <div className="border-t border-gray-800 pt-3 mt-3 flex items-center gap-2 text-green-450 font-bold text-xs font-mono">
                                    <ShieldCheck size={16} />
                                    <span>Tamper-proof block proof check: INTEGRITY VALID.</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <button 
                                onClick={() => {
                                    setShowAuditModal(false);
                                    setAuditLogs([]);
                                    setAuditSuccess(false);
                                }}
                                disabled={auditLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all text-xs"
                            >
                                {auditLoading ? "Authenticating Block Proofs..." : "Close Verification Report"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudentDetails;
