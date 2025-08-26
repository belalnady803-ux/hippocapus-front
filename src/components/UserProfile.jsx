import  { useState } from "react";
import { useAuthStore } from "../store/authStore";
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
          className="absolute top-full -left-[200%] mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg whitespace-nowrap z-10"
        >
          <div className="font-medium">{session?.fullName}</div>
          <div>
            <button 
              className="mt-4 bg-p1 rounded-2xl py-2 px-4 cursor-pointer" 
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