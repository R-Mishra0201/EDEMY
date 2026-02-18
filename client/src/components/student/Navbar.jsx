import React, { useContext } from "react";
import { assets } from "../../assets/assets.js";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext.jsx";
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { isEducator, navigate, backendURL, setIsEducator, getToken } = useContext(AppContext);
  
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator');
        return;
      }
      const token = await getToken();
      const { data } = await axios.post(backendURL + '/api/educator/update-role', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate('/educator');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
      />

      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={becomeEducator} className="hover:text-gray-900 transition font-medium">
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <span className="text-gray-400">|</span>
              <Link to="/my-enrollments" className="hover:text-gray-900 transition">My Enrollments</Link>
              <span className="text-gray-400">|</span>
              {/* ✅ Quiz Button - Desktop */}
              <Link
                to="/quiz"
                className="hover:text-gray-900 transition font-medium"
              >
                Quiz
              </Link>
            </>
          )}
        </div>
        {user ?
          <UserButton />
         :
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        }
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button onClick={becomeEducator} className="font-medium">
                {isEducator ? "Dashboard" : "Become Educator"}
              </button>
              <span>|</span>
              <Link to="/my-enrollments">Enrollments</Link>
              <span>|</span>
              {/* ✅ Quiz Button - Mobile */}
              <Link to="/quiz">Quiz</Link>
            </>
          )}
        </div>
        {user ?
          <UserButton />
         :
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="User icon" className="w-6" />
          </button>
        }
      </div>
    </div>
  );
};

export default Navbar;
