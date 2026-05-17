import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Search, ArrowRight, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

import axios from "axios";

const LandingPage = () => {
  const [Role, setRole] = useState("school");

  const [UserId, setUserId] = useState("");
  const [Password, setPassword] = useState("");
  const [trackId, setTrackId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // State to toggle the login view
  const [showLogin, setShowLogin] = useState(false);

  const {login} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) =>{
    e.preventDefault();
    setErrorMsg("");
    try {
        const response = await axios.post("/api/login", {
            id: UserId,
            password: Password
        });
        
        // Ensure role matches what they selected
        if (response.data.role !== Role) {
            setErrorMsg(`Invalid credentials for ${Role} role`);
            return;
        }

        login(response.data);
        navigate("/dashboard");
    } catch (error) {
        setErrorMsg(error.response?.data?.error || "Login Failed");
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if(trackId.trim()){
      navigate(`/track/${trackId.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      
      {/* Top Right Corner Button */}
      <div className="absolute top-6 right-6">
        {!showLogin ? (
            <button 
                onClick={() => setShowLogin(true)}
                className="text-sm font-bold text-gray-600 hover:text-gray-900 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200 transition-all flex items-center gap-2 hover:shadow-md"
            >
                <GraduationCap size={18} className="text-blue-600" />
                Institution Login
            </button>
        ) : (
            <button 
                onClick={() => setShowLogin(false)}
                className="text-sm font-bold text-gray-600 hover:text-gray-900 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200 transition-all flex items-center gap-2 hover:shadow-md"
            >
                <X size={18} className="text-gray-400" />
                Back to Tracking
            </button>
        )}
      </div>

      {/* Main Content Area */}
      {!showLogin ? (
          /* PUBLIC TRACKING PORTAL */
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8 md:p-12 border-t-4 border-blue-500 animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-50 text-blue-600 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto border-4 border-blue-100"> 
              <Search size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 text-center">Track Student</h2>
            <p className="text-base text-gray-500 mb-8 text-center px-2">Enter a Unique Student ID to publicly verify an educational journey and timeline.</p>
            
            <form onSubmit={handleTrack} className="space-y-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <input type="text"
                           value={trackId}
                           onChange={(e) => setTrackId(e.target.value)} 
                           placeholder="e.g. STU101245"
                           required
                           className="w-full pl-14 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-lg text-gray-900"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-md hover:shadow-lg">
                    Track Timeline <ArrowRight size={20} />
                </button>
            </form>
          </div>
      ) : (
          /* INSTITUTION LOGIN */
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border-t-4 border-gray-900 animate-in fade-in zoom-in duration-300">
            <div className="bg-gray-100 text-gray-900 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto"> 
              <GraduationCap size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Institution Portal</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Authorized access for Schools & Education Boards.</p>

            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRole("school")}
                className={`w-1/2 py-2.5 text-sm font-bold rounded-lg transition-all ${Role === "school" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >School</button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`w-1/2 py-2.5 text-sm font-bold rounded-lg transition-all ${Role === "admin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >Admin</button>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
                <input type="text"
                       value={UserId}
                       onChange={(e) => setUserId(e.target.value)} 
                       placeholder={Role === "school" ? "School ID (e.g. SCH001)" : "Admin User ID"}
                       required
                       className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all font-medium"
                />
                <input type="password"
                       value={Password}
                       onChange={(e)=> setPassword(e.target.value)}
                       placeholder="Password"
                       required
                       className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all font-medium"
                />
                
                {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center">
                        {errorMsg}
                    </div>
                )}

                <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors shadow-md mt-2">
                    Login to Dashboard
                </button>
            </form>
          </div>
      )}
    </div>
  );
}
export default LandingPage;