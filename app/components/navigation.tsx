"use client";
import samoedra from "@/public/samoedra_logo.png";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserIdFromToken } from "@/app/lib/auth"; // adjust path
import { useAuth } from "./AuthProvider";

export default function Navigation() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);
const [isAdminUser, setIsAdminUser] = useState(false);

  const { isLoggedIn, logout } = useAuth();
  // Decode user dari token
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setUserName("Guest");
        setLoading(false);
        return;
      }

      try {
        // Try API first
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId || payload.sub;
        
        if (userId) {
          const res = await fetch(`/api/auth/user?id=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          debugger;
        
          if (res.ok) {
            const result = await res.json();
              const email = result.existingUser.email;

            const adminEmails = [
            "admin@gmail.com",
            "maidisamoedra@gmail.com",
            ];

            setIsAdminUser(adminEmails.includes(email));
            setUserName(result.existingUser.email?.split('@')[0] || "User");
          } else {
            setUserName(payload.name || payload.email?.split('@')[0] || "User");
          }
        } else {
          setUserName(payload.email?.split('@')[0] || "User");
        }
      } catch (error) {
        console.error('User load error:', error);
        setUserName("User");
      } finally {
        setLoading(false);
      }
    };

    if(isLoggedIn){
        fetchUser()
    }
  }, [isLoggedIn]);

  // Fetch task count hari ini (inprogress/not yet)
 useEffect(() => {
  let isMounted = true; // 🔥 prevent memory leak

  const fetchTaskCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/tasks/daily", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed fetch");

      const result = await res.json();

      if (!isMounted) return;

      // ✅ hanya set jika hari kerja
      if (result.isWorkingDay) {
        setTaskCount(result.count ?? 0);
      } else {
        setTaskCount(0); // weekend
      }

    } catch (error) {
      console.error("Task daily error:", error);
      if (isMounted) setTaskCount(0);
    }
  };

  fetchTaskCount();

  // 🔁 auto refresh tiap 30 detik
  const interval = setInterval(fetchTaskCount, 30000);

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);

  const handleLogout = () => {
      logout(); // 🔥 ini penting
      router.push("/auth/login");
  };


  if (loading) {
    return (
      <nav className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="animate-pulse bg-white/20 h-12 w-32 rounded-lg" />
      </nav>
    );
  }

  if (!isLoggedIn) {
    return null; // ✅ Hide navigation jika belum login
  }
  return (
    <nav className="block w-full max-w-full px-4 py-2 text-white lg:px-8 lg:py-3 bg-gradient-to-r from-blue-300 to-indigo-600 shadow-xl">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        {/* Logo */}
        <a 
          onClick={() => router.push("/dashboard")}
          className="mr-4 cursor-pointer py-1.5 flex items-center gap-2"
        >
          <img src={samoedra.src} alt="Samoedra Logo" className="h-11 md:h-13" />
         
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Task Menu + Count */}
          <div className="relative group">
            <a 
              href="#" 
              className="flex items-center gap-2 p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all text-white font-semibold"
              onClick={(e) => { e.preventDefault(); router.push("/task"); }}
            >
              <svg fill="#000000" width="20px" height="20px" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <title>clipboard-line</title>
                <path d="M29.29,5H27V7h2V32H7V7H9V5H7A1.75,1.75,0,0,0,5,6.69V32.31A1.7,1.7,0,0,0,6.71,34H29.29A1.7,1.7,0,0,0,31,32.31V6.69A1.7,1.7,0,0,0,29.29,5Z" className="clr-i-outline clr-i-outline-path-1"></path><path d="M26,7.33A2.34,2.34,0,0,0,23.67,5H21.87a4,4,0,0,0-7.75,0H12.33A2.34,2.34,0,0,0,10,7.33V11H26ZM24,9H12V7.33A.33.33,0,0,1,12.33,7H16V6a2,2,0,0,1,4,0V7h3.67a.33.33,0,0,1,.33.33Z" className="clr-i-outline clr-i-outline-path-2"></path><rect x="11" y="14" width="14" height="2"   className="clr-i-outline clr-i-outline-path-3"></rect><rect x="11" y="18" width="14" height="2" className="clr-i-outline clr-i-outline-path-4"></rect><rect x="11" y="22" width="14" height="2" className="clr-i-outline clr-i-outline-path-5"></rect><rect x="11" y="26" width="14" height="2" className="clr-i-outline clr-i-outline-path-6"></rect>
                <rect x="0" y="0" width="36" height="36" fillOpacity="0"/>
            </svg>
              <span>Tasks</span>
              
              {/* Count Badge */}
              {taskCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold shadow-lg animate-pulse">
                  {taskCount}
                </span>
              )}
            </a>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none">
              {loading ? 'Loading...' : `${taskCount} pending hari ini`}
            </div>
          </div>

          {/* User Profile */}
          <div className="relative group">
            <button
              id="dropdown"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all text-white font-semibold"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <span>{userName}</span>
              <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 z-50 animate-dropdown">
                <div className="p-4 border-b border-gray-100">
                  <div className="font-semibold text-gray-800">{userName}</div>
                  <div className="text-sm text-gray-500">Caregiver</div>
                </div>
                <div className="py-2">
                    {isAdminUser && (
                  <a 
                    href="/profile" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                     onClick={(e) => {
        e.preventDefault();
        router.push("/report");
         setDropdownOpen(false);
      }}
                  >
                      📊 <span>Report</span>
                  </a>
                    )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          id="dropdown-mobile"
          className="lg:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-all"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {dropdownOpen && (
        <div className="lg:hidden mt-2 pb-4 px-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border">
          <div className="flex flex-col gap-3 py-4">
            {/* Tasks */}
            <a 
              href="#" 
              className="flex items-center gap-3 p-3 rounded-xl bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition-all"
              onClick={(e) => {
                e.preventDefault();
                router.push("/task");
                setDropdownOpen(false);
              }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 36 36">
                {/* Clipboard SVG */}
              </svg>
              Tasks 
              {taskCount > 0 && (
                <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
                  {taskCount}
                </span>
              )}
            </a>

            {/* User Info */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="font-semibold text-gray-800">{userName}</div>
              <div className="text-sm text-gray-500 truncate">Caregiver</div>
            </div>
              <div className="p-3">
                {isAdminUser && (
                  <a 
                    href="/profile" 
                    className="block py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                     onClick={(e) => {
        e.preventDefault();
        router.push("/report");
         setDropdownOpen(false);
      }}
                  >
                      📊 <span>Report</span>
                  </a>
                    )}
              </div>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full p-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all flex items-center gap-2"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}