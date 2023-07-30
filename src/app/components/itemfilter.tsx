import React, { useState, useEffect } from "react";

export default function ItemFilter() {
  const URLParams = new URLSearchParams(window.location.search);
  const statusSouvenir = Number(URLParams.get('souvenir')) || 0;
  const statusStatTrak = Number(URLParams.get('stattrak')) || 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [souvenirState, setSouvenirState] = useState(statusSouvenir);
  const [stattrakState, setStatTrakState] = useState(statusStatTrak);
  const [clickCount, refreshPage] = useState(0);

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };

  // This is what happens when souvenir button is clicked
  const handleSouvenirClick = () => {
    // Cycle through the three states (0, 1, and 2)
    const nextState = (souvenirState + 1) % 3;
    setSouvenirState(nextState);
  
    // Construct the URL and update the parameter
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
  
    if (nextState === 1) {
      params.set("souvenir", "1");
    } else if (nextState === 2) {
      params.set("souvenir", "2");
    } else {
      params.delete("souvenir");
    }
  
    url.search = params.toString();
    window.history.pushState({ path: url.toString() }, "", url.toString());
  
    // Refresh page after a short delay
    refreshPage(1);
  };

  // This is what happens when stattrak button is clicked
  const handleStatTrakClick = () => {
    // Cycle through the three states (0, 1, and 2)
    const nextState = (stattrakState + 1) % 3;
    setStatTrakState(nextState);
  
    // Construct the URL and redirect
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
  
    if (nextState === 1) {
      params.set("stattrak", "1");
    } else if (nextState === 2) {
      params.set("stattrak", "2");
    } else {
      params.delete("stattrak");
    }
  
    url.search = params.toString();
    window.history.pushState({ path: url.toString() }, "", url.toString());
  
    // Refresh page after a short delay
    refreshPage(1);
  };

  // Reload the page after a 1 second delay
  useEffect(() => {
    if (clickCount == 1) {
      // Wait for 1 second before reloading the page
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 1000);
      // Clean up the timeout when the component unmounts or the click count changes
      return () => clearTimeout(timeout);
    }
  }, [clickCount]);

  // Makes sure the redirect occurs when there is text in the
  // search box and enter is pressed
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if the "Enter" key was pressed (keyCode 13) or (key === "Enter" for newer browsers)
      if (event.keyCode === 13 || event.key === "Enter") {
        // Trim the search term and check if it's not empty
        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm !== "") {
          // Construct the URL
          const url = new URL(window.location.href);
          const params = new URLSearchParams(url.search);
          params.set("search", trimmedSearchTerm);
          
          // Update the URL and reload the page
          url.search = params.toString();
          window.history.pushState({ path: url.toString() }, "", url.toString());
          window.location.replace(url.toString());
        }
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("keyup", handleKeyPress);
    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, [searchTerm, souvenirState, stattrakState]);

  return (
    <div className="bg-gradient-to-br from-cyan-700 to-sky-600 h-60 w-screen flex items-center justify-between px-4">
      <div className="flex items-center space-x-6">
        {/* Contains search bar, souvenir/stattrak/rarity buttons */}
        <div className="flex flex-col py-2">
          {/* Search bar */}
          <input className="w-96 h-12 bg-white text-gray-600 py-1 px-4 rounded-full focus:outline-none my-2"
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={handleChange}
            id="searchInput"
            style={{ fontSize: '18px' }}
          />
          <div className="flex space-x-2 justify-between">
            <SouvenirFilter onClick={handleSouvenirClick} souvenirState={souvenirState} />
            <StatTrakFilter onClick={handleStatTrakClick} stattrakState={stattrakState} />
          </div>
          <RarityFilter></RarityFilter>
        </div>
        <WearButtons></WearButtons>
      </div>
      {/* Gun Type buttons */}
      <div className="flex space-x-4">
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          Knife
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          Pistol
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          Rifle
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          SMG
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          Heavy
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          Gloves
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          Container
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          Agent
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          Sticker
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white">
          Other
        </button>
      </div>
    </div>
  );
}

function SouvenirFilter({ onClick, souvenirState }) {
  const buttonClassNames = [
    "bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm cursor-pointer text-white flex-grow py-4",
    "bg-yellow-400 hover:bg-yellow-300 hover:scale-[1.025] drop-shadow-lg rounded-sm cursor-pointer text-white flex-grow py-4",
    "bg-zinc-800 hover:bg-zinc-700 hover:scale-[1.025] drop-shadow-lg rounded-sm cursor-pointer text-white flex-grow py-4",
  ];

  return (
    <>
      {souvenirState >= 0 && souvenirState <= 2 && (
        <button
          className={buttonClassNames[souvenirState]}
          onClick={onClick}
        >
          Souvenir
        </button>
      )}
    </>
  );
}

function StatTrakFilter({ onClick, stattrakState }) {
  const buttonClassNames = [
    "bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm cursor-pointer text-white flex-grow py-4",
    "bg-orange-600 hover:bg-orange-500 hover:scale-[1.025] drop-shadow-lg rounded-sm cursor-pointer text-white flex-grow py-4",
    "bg-zinc-800 hover:bg-zinc-700 hover:scale-[1.025] drop-shadow-lg rounded-sm cursor-pointer text-white flex-grow py-4",
  ];

  return (
    <>
      {stattrakState >= 0 && stattrakState <= 2 && (
        <button
          className={buttonClassNames[stattrakState]}
          onClick={onClick}
        >
          StatTrak
        </button>
      )}
    </>
  );
}

function RarityFilter(){
  return (
    <div className="relative group">
      <div className="bg-sky-700 drop-shadow-lg rounded-sm cursor-pointer text-white flex items-center justify-center py-4 my-2">
        Rarity
      </div>
      <div className="hidden group-hover:flex absolute top-full w-full bg-white border rounded-sm shadow-md">
        <div className="w-5 h-16 flex-grow" style={{backgroundColor: '#b0c3d9'}}></div>
        <div className="w-5 h-16 flex-grow" style={{backgroundColor: '#5e98d9'}}></div>
        <div className="w-5 h-16 flex-grow" style={{backgroundColor: '#4b69ff'}}></div>
        <div className="w-5 h-16 flex-grow" style={{backgroundColor: '#8847ff'}}></div>
        <div className="w-5 h-16 flex-grow" style={{backgroundColor: '#d32ce6'}}></div>
        <div className="w-5 h-16 flex-grow" style={{backgroundColor: '#eb4b4b'}}></div>
        <div className="w-5 h-16 flex-grow" style={{backgroundColor: '#ffae39'}}></div>
      </div>
    </div>
  );
}

function WearButtons(){
  const [selectedItems, setSelectedItems] = useState([
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred',
  ]);

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

  return (
    <div className="bg-sky-700 rounded p-2 flex flex-col items-start">
    {['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'].map((item) => (
      <label
        key={item}
        className="inline-flex items-center hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer"
      >
        <input
          type="checkbox"
          className="form-checkbox mr-2"
          checked={selectedItems.includes(item)}
          onChange={() => handleToggle(item)}
        />
        {item}
      </label>
    ))}
  </div>
  );
}