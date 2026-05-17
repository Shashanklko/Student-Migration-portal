export const mockDashboardStats = {
  totalStudents: 12450,
  freshAdmissions: 5932,
  transferredStudents: 2134,
  registeredSchools: 310
};

export const mockSchools = [
  { id: "SCH001", name: "ABC Public School", region: "North District" },
  { id: "SCH002", name: "XYZ Senior Secondary School", region: "South District" },
  { id: "SCH003", name: "Global International School", region: "East District" }
];

export const mockStudents = [
  {
    uniqueId: "STU101245",
    name: "Rahul Sharma",
    fatherName: "Raj Sharma",
    motherName: "Sunita Sharma",
    dob: "2010-05-14",
    gender: "Male",
    address: "123 Main St, New Delhi, India",
    qualification: "Class 10",
    status: "Active",
    currentSchoolId: "SCH002",
    currentSchoolName: "XYZ Senior Secondary School",
    history: [
      {
        schoolName: "ABC Public School",
        lastClass: "Class 9",
        joinedYear: "2021",
        leftYear: "2024"
      },
      {
        schoolName: "XYZ Senior Secondary School",
        joinedYear: "2024",
        leftYear: "Present"
      }
    ]
  },
  {
    uniqueId: "STU101246",
    name: "Priya Patel",
    fatherName: "Sanjay Patel",
    motherName: "Meena Patel",
    dob: "2011-08-22",
    gender: "Female",
    address: "45 Park Avenue, Mumbai, India",
    qualification: "Class 9",
    status: "Transferred",
    currentSchoolId: "SCH002",
    currentSchoolName: "XYZ Senior Secondary School",
    history: [
      {
        schoolName: "ABC Public School",
        lastClass: "Class 8", // <-- Added this!
        joinedYear: "2021",
        leftYear: "2024"
      }
    ]
  }
];

export const mockAuthUser = {
  id: "USR001",
  name: "Govt Admin",
  role: "admin", // 'admin' or 'school'
  schoolId: null
};
