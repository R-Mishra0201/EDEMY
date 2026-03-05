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
          overflow-hidden
          bg-white border-2 rounded-xl sm:rounded-2xl
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-in-out
          ${isFocused ? "border-blue-500 shadow-lg ring-2 ring-blue-200" : "border-gray-300"}
        `}
      >
        <img
          src={assets.search_icon}
          alt="search_icon"
          className={`
            w-4 h-4 sm:w-5 sm:h-5
            ml-3 mr-2 sm:mx-4
            flex-shrink-0
            transition-transform duration-300
            ${isFocused ? "scale-110" : "scale-100"}
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
            flex-1
            min-w-0
            h-full
            outline-none
            bg-transparent
            text-gray-700
            text-sm sm:text-base
            placeholder:text-gray-400
          "
        />

        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="
              flex-shrink-0
              p-1 sm:p-1.5
              text-gray-400 hover:text-gray-600
              transition-colors duration-200
            "
            aria-label="Clear search"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        <button
          type="submit"
          disabled={!input.trim()}
          className="
            flex-shrink-0
            self-stretch
            bg-blue-600
            text-white
            text-xs sm:text-sm
            font-medium
            px-3 sm:px-5 md:px-6
            hover:bg-blue-700 active:bg-blue-800
            disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors duration-200
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
