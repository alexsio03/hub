import React, { useState, useEffect } from "react";

export default function ItemFilter() {
  const URLParams = new URLSearchParams(window.location.search);
  const searchedItem = URLParams.get('search') || "";
  const statusSouvenir = Number(URLParams.get('souvenir')) || 0;
  const statusStatTrak = Number(URLParams.get('stattrak')) || 0;
  const statusWear = URLParams.get('wear') || '11111';

  const [searchTerm, setSearchTerm] = useState(searchedItem);
  const [souvenirState, setSouvenirState] = useState(statusSouvenir);
  const [stattrakState, setStatTrakState] = useState(statusStatTrak);
  const [wearState, setWearState] = useState(statusWear);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };

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
    // refreshPage(1);
    startRefreshTimer();
  };

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
    // refreshPage(1);
    startRefreshTimer();
  };

  const handleWearClick = (updatedWear: string) => {  
    // Construct the URL and redirect
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    setWearState(updatedWear);
  
    params.set("wear", updatedWear);

    url.search = params.toString();
    window.history.pushState({ path: url.toString() }, "", url.toString());
  
    // Refresh page after a short delay
    // refreshPage(1);
    startRefreshTimer();
  }

  const startRefreshTimer = () => {
    if (refreshTimer !== null) {
      clearTimeout(refreshTimer);
    }
    const timerId = setTimeout(() => {
      window.location.reload();
    }, 1000);
    setRefreshTimer(timerId);
  };

  // Makes sure the redirect occurs when there is text in the search box and enter is pressed
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
    <div className="bg-gradient-to-br from-cyan-700 to-sky-600 h-60 flex flex-grow items-center justify-between">
      <div className="flex items-center space-x-6 mx-4">
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
          <RarityFilter/>
        </div>
        <WearButtons handleAnyClick={handleWearClick} wearState={wearState} />
      </div>
      {/* Gun Type buttons */}
      <div className="flex mx-2 flex-grow space-x-2">
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
          Knife
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
          Pistol
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
          Rifle
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
          SMG
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
          Heavy
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
          Gloves
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
          Container
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
          Agent
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
          Sticker
        </button>
        <button className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer text-white flex-grow h-20">
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

function WearButtons({ handleAnyClick, wearState }) {
  const wearItems = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];

  const [selectedItems, setSelectedItems] = useState(wearState);

  const handleToggle = (itemName: string) => {
    handleAnyClick(selectedItems);
    setSelectedItems((prevSelectedItems: string) => {
      const itemIndex = wearItems.indexOf(itemName);
      const newSelectedItems = prevSelectedItems.split('');
      newSelectedItems[itemIndex] = newSelectedItems[itemIndex] === '1' ? '0' : '1';
      return newSelectedItems.join('');
    });
  };

  const handleOnly = (itemName: string) => {
    const newSelectedItems = wearItems.map((item) => (item === itemName ? '1' : '0')).join('');
    setSelectedItems(newSelectedItems);
    handleAnyClick(newSelectedItems);
  };

  return (
    <div className="bg-sky-700 rounded p-2 flex flex-col items-start">
      {wearItems.map((item, index) => (
        <div key={item} className="flex items-center justify-between">
          <label className="inline-flex items-center hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm px-3 py-1 my-1 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox mr-2"
              checked={selectedItems[index] === '1'}
              onChange={() => handleToggle(item)}
            />
            {item}
          </label>
          <button
            onClick={() => handleOnly(item)}
            className="px-2 py-1 hover:bg-sky-600 hover:scale-[1.025] rounded"
          >
            ONLY
          </button>
        </div>
      ))}
    </div>
  );
}