import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar";

const DashBoardLayout = () => {
    const location = useLocation();
    
    // Check if we are at the exact root dashboard route
    const isRootDashboard = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

    return (
        <div className="min-h-screen bg-gray-50 flex p-4 gap-4">
            
            {/* ONLY show Sidebar if we are NOT on the root dashboard */}
            {!isRootDashboard && (
                <div className="w-64 bg-white rounded-2xl shadow-sm hidden md:block">
                    <Sidebar/>
                </div>
            )}
            
            <div className="flex-1 flex flex-col">
                {/* Remove the white background box if we are on the root so the big cards float on the gray background */}
                <main className={`flex-1 ${!isRootDashboard ? 'bg-white rounded-2xl shadow-sm' : ''} p-6 overflow-y-auto`}>
                    <Outlet />
                </main>
            </div>

        </div>
    )
}

export default DashBoardLayout;
