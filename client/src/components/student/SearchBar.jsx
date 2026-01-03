import React, { useState } from "react";
import { assets } from "../../assets/assets.js";
import { data, useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");
  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };

  return (
    <div className="w-full flex justify-center px-4">
      <form
  onSubmit={onSearchHandler}
  className="
    w-full max-w-md
    h-10 sm:h-11
    flex items-center
    bg-white border border-gray-300 rounded-xl
    shadow-sm
  "
>
  <img
    src={assets.search_icon}
    alt="search_icon"
    className="w-5 sm:w-6 mx-3"
  />

  <input
    onChange={(e) => setInput(e.target.value)}
    value={input}
    type="text"
    placeholder="Search courses..."
    className="
      flex-1 h-full
      outline-none
      text-gray-700
      text-sm sm:text-base
      px-2
    "
  />

  <button
    type="submit"
    className="
      bg-blue-600 text-white
      text-sm rounded-xl
      px-4 py-1.5 mx-2
      hover:bg-blue-700 transition
    "
  >
    Search
  </button>
</form>

    </div>
  );
};

export default SearchBar;
