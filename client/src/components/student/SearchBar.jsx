import React, { useState } from "react";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");
  const [isFocused, setIsFocused] = useState(false);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate("/course-list/" + input);
    }
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={onSearchHandler}
        className={`
          w-full max-w-xl
          h-11 sm:h-12 md:h-14
          flex items-center
          bg-white border-2 rounded-xl sm:rounded-2xl
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-in-out
          ${isFocused ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-300'}
        `}
      >
        <img
          src={assets.search_icon}
          alt="search_icon"
          className={`
            w-5 h-5 sm:w-6 sm:h-6
            mx-3 sm:mx-4
            transition-transform duration-300
            ${isFocused ? 'scale-110' : 'scale-100'}
          `}
        />
        
        <input
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={input}
          type="text"
          placeholder="Search courses..."
          className="
            flex-1 h-full
            outline-none
            text-gray-700
            text-sm sm:text-base md:text-lg
            px-2 sm:px-3
            placeholder:text-gray-400
          "
        />

        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="
              p-1.5 sm:p-2
              mr-2
              text-gray-400 hover:text-gray-600
              transition-all duration-200
              hover:bg-gray-100 rounded-full
            "
            aria-label="Clear search"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          disabled={!input.trim()}
          className="
            bg-blue-600 text-white
            text-xs sm:text-sm md:text-base
            font-medium
            rounded-lg sm:rounded-xl
            px-3 sm:px-5 md:px-6
            py-2 sm:py-2.5
            mr-1.5 sm:mr-2
            hover:bg-blue-700 active:bg-blue-800
            disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-all duration-200
            transform hover:scale-105 active:scale-95
            shadow-sm hover:shadow-md
          "
        >
          <span className="hidden sm:inline">Search</span>
          <span className="sm:hidden">Go</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
