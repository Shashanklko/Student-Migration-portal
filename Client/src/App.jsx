import { useState } from 'react'
import { Route, Router, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import DashBoardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import StudentDetails from './pages/StudentDetails';
import SearchStudent from './pages/SearchStudent';
import EnrollStudent from './pages/EnrollStudent';
import CurrentStudents from './pages/CurrentStudents';
import AddSchool from './pages/AddSchool';
import ListedSchools from './pages/ListedSchools';
import SchoolProfile from './pages/SchoolProfile';

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/track/:id" element={<div className="min-h-screen bg-gray-50 py-10 px-4"><StudentDetails /></div>} />
                <Route path="/dashboard" element={<DashBoardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="addStudent" element={<AddStudent />} />
                    <Route path="student/:id" element={<StudentDetails />} />
                    <Route path="search" element={<SearchStudent />} />
                    <Route path="enroll" element={<EnrollStudent />} />
                    <Route path="students" element={<CurrentStudents />} />
                    <Route path="addSchool" element={<AddSchool />} />
                    <Route path="schools" element={<ListedSchools />} />
                    <Route path="schoolProfile" element={<SchoolProfile />} />
                </Route>
            </Routes>
        </AuthProvider >
    );
}
export default App;