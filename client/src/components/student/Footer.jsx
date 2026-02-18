import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const Footer = () => {
  const navigate = useNavigate(); // 2. Initialize the hook

  return (
    <footer className="bg-gray-900 md:px-36 w-full text-left mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">

        {/* Logo + Description */}
        <div className="flex flex-col md:items-start items-center w-full max-w-sm">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex flex-col leading-tight"
          >
            <span className="text-blue-700 font-extrabold text-sm sm:text-base lg:text-lg tracking-wide uppercase">
              Intelligent E-Learning
            </span>
            <span className="text-cyan-600 font-semibold text-xs sm:text-sm lg:text-base tracking-widest uppercase">
              Management System
            </span>
            <span className="text-gray-400 font-medium text-xs tracking-widest uppercase">
              (LMS)
            </span>
          </div>
          <p className="mt-6 text-center md:text-left text-sm text-white/80 leading-relaxed">
            Empowering students with knowledge through a seamless and intelligent learning experience.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="text-white font-semibold mb-5">Company</h2>
          <ul className="flex md:flex-col w-full md:items-start items-center text-sm text-white/80 md:space-y-2 gap-3 md:gap-0">
            <li 
                onClick={() => navigate("/")} 
                className="hover:text-blue-400 transition cursor-pointer"
            >
                Home
            </li>
            <li className="hover:text-blue-400 transition cursor-pointer">About Us</li>
            <li className="hover:text-blue-400 transition cursor-pointer">Contact</li>
            <li className="hover:text-blue-400 transition cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="text-white font-semibold mb-5">Subscribe to Newsletter</h2>
          <p className="text-sm text-white/80">
            Stay updated with our latest courses and offers. Subscribe to our newsletter.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-500/30 bg-gray-800 text-gray-300 placeholder-gray-500 outline-none w-64 h-10 rounded px-3 text-sm"
            />
            <button className="bg-blue-600 h-10 px-5 text-white rounded hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        Copyright © 2026 Edemy-Rahul Mishra. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
