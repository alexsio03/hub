import React, { useState, useEffect } from "react";

export default function ItemFilter() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyPress = (event: { keyCode: number; key: string; }) => {
      // Check if the "Enter" key was pressed (keyCode 13) or (key === "Enter" for newer browsers)
      if (event.keyCode === 13 || event.key === "Enter") {
        // Trim the search term and check if it's not empty
        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm !== "") {
          // Construct the URL and redirect
          const url = `http://localhost:3000/market?search=${encodeURIComponent(trimmedSearchTerm)}`;
          window.location.href = url;
        }
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("keyup", handleKeyPress);
    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, [searchTerm]);

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };
  
  return (
    <div className="bg-blue-900 h-36 w-screen flex items-center justify-between px-4">
      <div className="relative">
        <input
          type="text"
          className="w-64 bg-white text-gray-600 py-1 px-4 rounded-full focus:outline-none"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={handleChange}
          id="searchInput"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </div>
      </div>
    </div>
  );
}