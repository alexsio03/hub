import React, { useState, useEffect } from "react";

export default function ItemFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred',
  ]);

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };

  // Toggles checkbox for wear of items
  const handleToggle = (itemName: string) => {
    setSelectedItems((prevSelectedItems) => {
      // Toggle the clicked item as before
      if (prevSelectedItems.includes(itemName)) {
        // If the item is already selected, remove it from the selection
        return prevSelectedItems.filter((item) => item !== itemName);
      } else {
        // If the item is not selected, add it to the selection
        return [...prevSelectedItems, itemName];
      }
    });
  };  

  // Makes sure the redirect occurs when there is text in the 
  // search box and enter is pressed
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

  return (
    <div className="bg-gradient-to-br from-cyan-700 to-sky-600 h-40 w-screen flex items-center justify-between px-4">
      <div className="flex items-center space-x-6">
        <input
          type="text"
          className="w-64 bg-white text-gray-600 py-1 px-4 rounded-full focus:outline-none"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={handleChange}
          id="searchInput"
        />
        <div className="flex flex-col items-start">
          {['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'].map((item) => (
            <SelectableItem
              key={item}
              label={item}
              isChecked={selectedItems.includes(item)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SelectableItemProps {
  label: string;
  isChecked: boolean;
  onToggle: (label: string) => void;
}

function SelectableItem({ label, isChecked, onToggle }: SelectableItemProps) {
  const handleClick = () => {
    onToggle(label);
  };
  return (
    <div className="flex items-center my-1">
      <input type="checkbox" checked={isChecked} onChange={handleClick} className="mr-2" />
      <span onClick={handleClick}>{label}</span>
    </div>
  );
}