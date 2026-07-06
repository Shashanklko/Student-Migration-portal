import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashBoardLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex p-4 gap-4 overflow-hidden">
                <div className="w-64 bg-white rounded-2xl shadow-sm border border-gray-100 hidden md:block shrink-0">
                    <Sidebar />
                </div>
                
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default DashBoardLayout;