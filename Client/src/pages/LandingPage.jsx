import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, X, GraduationCap, Building, ShieldCheck, Users, Clock, CheckCircle2, Share2, Landmark, Laptop } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../assets/eduvera_hero.png";
import axios from "axios";

const LandingPage = () => {
  const [Role, setRole] = useState("school");
  const [UserId, setUserId] = useState("");
  const [Password, setPassword] = useState("");
  const [trackId, setTrackId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isResetRequest, setIsResetRequest] = useState(false);
  const [resetSchoolId, setResetSchoolId] = useState("");
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");
  const [showPasswordText, setShowPasswordText] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Listen to the navigation bar's event to trigger login modal
  useEffect(() => {
    const handleShowLogin = () => {
      setShowLogin(true);
    };
    window.addEventListener("show-login-portal", handleShowLogin);
    return () => {
      window.removeEventListener("show-login-portal", handleShowLogin);
    };
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15 // trigger when 15% of element is in view
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await axios.post("/api/login", {
        id: UserId,
        password: Password
      });
      
      const userRole = response.data.role;
      const isValidRole = userRole === Role || (userRole === 'school-admin' && Role === 'school');

      if (!isValidRole) {
        setErrorMsg(`Invalid credentials for ${Role} role`);
        return;
      }

      login(response.data);
      setShowLogin(false);
      // Reset password toggle view
      setShowPasswordText(false);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Login Failed");
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setResetSuccessMsg("");
    try {
      const response = await axios.post("/api/reset-request", {
        schoolId: resetSchoolId
      });
      setResetSuccessMsg(response.data.message);
      setResetSchoolId("");
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Reset Request Failed");
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track/${trackId.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col relative overflow-x-hidden">
      <Navbar />

      {/* Hero Section Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Side: Brand Value and Search */}
        <div className="flex-1 space-y-8 text-left max-w-2xl animate-in fade-in slide-in-from-left-6 duration-500">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
              <ShieldCheck size={14} /> Decentralised Academic Ledger
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
              Centralized Student Profile <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Migration Portal</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-medium">
              Eduvera provides an unbreakable unified record for student journeys. Seamlessly transition student profiles, history, and certifications between schools, universities, and graduation levels.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#track"
              className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all flex items-center gap-2"
            >
              Verify Student Timeline <ArrowRight size={16} />
            </a>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-3.5 text-sm font-bold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              Institution Dashboard
            </button>
          </div>

          {/* Stats Bar (Animated reveal) */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100 reveal">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Building size={16} className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Institutions</span>
              </div>
              <p className="text-2xl font-black text-gray-900">4,200+</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Users size={16} className="text-indigo-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Students</span>
              </div>
              <p className="text-2xl font-black text-gray-900">1.2M+</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock size={16} className="text-purple-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Accuracy</span>
              </div>
              <p className="text-2xl font-black text-gray-900">100%</p>
            </div>
          </div>

        </div>

        {/* Right Side: Hero Visual illustration */}
        <div className="flex-1 w-full flex justify-center items-center animate-in fade-in slide-in-from-right-6 duration-500 delay-100">
          <div className="relative w-full max-w-md md:max-w-lg aspect-square">
            <div className="absolute inset-0 bg-blue-100/50 rounded-3xl filter blur-3xl transform -rotate-6 scale-95 opacity-70"></div>
            <img
              src={heroImage}
              alt="Eduvera student profile visual illustration"
              className="relative w-full h-full object-contain rounded-3xl hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 drop-shadow-xl"
            />
          </div>
        </div>

      </main>

      {/* Track Form Section Anchor */}
      <section id="track" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto space-y-3 mb-8 reveal">
            <h2 className="text-3xl font-black text-gray-900">Search Verification Registry</h2>
            <p className="text-sm text-gray-500">Input a unique Student ID below to trace their educational history, course specs, and transfer journey.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-100/60 border border-gray-100 max-w-2xl mx-auto reveal">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="e.g. STU101245 or RAHUL052010"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-base text-gray-900 placeholder-gray-400 text-left"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                Track Timeline <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16 reveal">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Core Features</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Centralized Academic Tracking</h2>
            <p className="text-sm sm:text-base text-gray-500">Eduvera standardizes academic record keeping, providing secure and automated student transitions across institutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left space-y-4 reveal">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Immutable Student ID</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Generate a life-long Unique ID on registration. Student identity details remain constant across schools, colleges, and university levels.
              </p>
            </div>

            {/* feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left space-y-4 reveal">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Share2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Transfer Certificate (TC)</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Schools issue automated TCs online to discharge students. This unlocks the profile, making them instantly ready for enrollment in college.
              </p>
            </div>

            {/* feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left space-y-4 reveal">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Graduation Registry</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Supports higher education. Manage courses (B.Tech, MBA, M.Sc), branches, roll numbers, admission years, and expected completions.
              </p>
            </div>

            {/* feature 4 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left space-y-4 reveal">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Laptop size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Verification Engine</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Public stakeholders can instantly audit student timelines. Shows complete historical school names, courses, and migration dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics & Network Registry Section */}
      <section id="statistics" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Text description */}
            <div className="flex-1 space-y-6 text-left max-w-xl reveal">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Network State</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Interlinked Board & University Network</h2>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Eduvera connects diverse education systems. Central administrators, regional boards, private schools, and government universities share a unified lookup standard.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  Secondary & Higher Secondary Boards (K-12)
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  State and Central Higher Education Universities
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  Technical, Vocational and Diploma Institutions
                </li>
              </ul>
            </div>

            {/* Visual Registry Mock Display */}
            <div className="flex-1 w-full bg-gray-50 border border-gray-100 p-8 rounded-3xl space-y-4 max-w-lg text-left shadow-sm reveal">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Central Board Connections</h4>
              
              {/* board 1 */}
              <div className="flex items-center justify-between bg-white px-4 py-3.5 rounded-2xl border border-gray-100 shadow-sm hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">CB</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Central Board of Secondary Education</p>
                    <p className="text-[10px] text-gray-400">Status: Verified Ledger</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
              </div>

              {/* board 2 */}
              <div className="flex items-center justify-between bg-white px-4 py-3.5 rounded-2xl border border-gray-100 shadow-sm hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">CU</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Central Universities Council</p>
                    <p className="text-[10px] text-gray-400">Status: Verified Ledger</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
              </div>

              {/* board 3 */}
              <div className="flex items-center justify-between bg-white px-4 py-3.5 rounded-2xl border border-gray-100 shadow-sm hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">TB</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Technical Education Board</p>
                    <p className="text-[10px] text-gray-400">Status: Verified Ledger</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      {/* Glassmorphic Institution Login Modal Overlay */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-8 relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowLogin(false);
                setErrorMsg("");
                setIsResetRequest(false);
                setResetSchoolId("");
                setResetSuccessMsg("");
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <GraduationCap size={28} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                {isResetRequest ? "Reset Password" : "Institution Portal"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {isResetRequest ? "Submit a password reset request to Board" : "Authorized access for Schools & Boards"}
              </p>
            </div>

            {!isResetRequest ? (
              <>
                {/* Toggle Role */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setRole("school")}
                    className={`w-1/2 py-2 text-sm font-bold rounded-lg transition-all ${Role === "school" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                  >School</button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`w-1/2 py-2 text-sm font-bold rounded-lg transition-all ${Role === "admin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                  >Admin</button>
                </div>

                {/* Login Form */}
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">User Credentials ID</label>
                    <input
                      type="text"
                      value={UserId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder={Role === "school" ? "School ID (e.g. SCH001)" : "Admin User ID"}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPasswordText ? "text" : "password"}
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 text-left pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordText(!showPasswordText)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700"
                      >
                        {showPasswordText ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span />
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetRequest(true);
                        setErrorMsg("");
                      }}
                      className="text-blue-600 hover:text-indigo-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  
                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold text-center">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all mt-4"
                  >
                    Sign In to Dashboard
                  </button>
                </form>
              </>
            ) : (
              // Reset Request Form
              <form className="space-y-4" onSubmit={handleResetRequest}>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Institution ID (School / University ID)</label>
                  <input
                    type="text"
                    value={resetSchoolId}
                    onChange={(e) => setResetSchoolId(e.target.value.toUpperCase())}
                    placeholder="e.g. SCH001"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 text-left font-mono"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold text-center">
                    {errorMsg}
                  </div>
                )}

                {resetSuccessMsg && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-xl text-sm font-semibold text-center">
                    Request Submitted! Check Institution Admin Dashboard.
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all mt-4"
                >
                  Submit Reset Request
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsResetRequest(false);
                    setErrorMsg("");
                    setResetSuccessMsg("");
                  }}
                  className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-800 py-1"
                >
                  Back to Log In
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;