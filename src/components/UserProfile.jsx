import  { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router";
import avatar from "../assets/doc-avatar.jpg";

const UserProfile = ({ setIsHover, session, isHover }) => {
  const { logout } = useAuthStore();
  const [leaveTimeout, setLeaveTimeout] = useState(null);
  const handleMouseEnter = () => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      setLeaveTimeout(null);
    }
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHover(false);
    }, 100);
    setLeaveTimeout(timeout);
  };
  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="w-10 h-10 bg-p1 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md hover:bg-blue-600 transition-colors cursor-pointer" 
      >
        <img src={avatar} alt="avatar"  className="rounded-full"/>
      </div>
      {isHover && (
        <div 
          className="absolute top-full -left-[200%] mt-2 p-3 bg-white border dark:bg-gray-800 border-gray-200 rounded-lg shadow-lg whitespace-nowrap z-10 dark:border-gray-700"
        >
          <div className="font-medium text-gray-900 dark:text-white px-2 mb-2">{session?.fullName}</div>
          
          <div className="flex flex-col gap-1 border-t border-gray-100 dark:border-gray-700 pt-2 mb-2">
            {session?.roles?.includes("admin") && (
              <Link 
                to="/admin" 
                className="px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                onClick={() => setIsHover(false)}
              >
                Dashboard
              </Link>
            )}
            
            {session?.roles?.includes("instructor") && (
              <Link 
                to="/instructor/dashboard" 
                className="px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                onClick={() => setIsHover(false)}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div>
            <button 
              className="mt-2 bg-p1 rounded-2xl py-2 px-4 cursor-pointer dark:bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full text-center" 
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;