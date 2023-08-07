import React, { useState, useEffect } from "react";

export default function ItemFilter({trade}) {
  console.log(trade)
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
    startRefreshTimer();
  };

  const handleTypeClick = (type: string) => {  
    // Construct the URL and redirect
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
  
    params.set("type", type);

    url.search = params.toString();
    window.history.pushState({ path: url.toString() }, "", url.toString());
  
    // Refresh page after a short delay
    startRefreshTimer();
  };

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

  const knifeTypes = ["Bayonet", "Bowie Knife", "Butterfly Knife", "Classic Knife", "Falchion Knife", "Flip Knife", "Gut Knife", "Huntsman Knife", "Karambit", 
  "M9 Bayonet", "Navaja Knife", "Nomad Knife", "Paracord Knife", "Shadow Daggers", "Skeleton Knife", "Stiletto Knife", "Survival Knife", "Talon Knife", "Ursus Knife"]
  const rifleTypes = ["AWP", "AK-47", "M4A4", "M4A1-S", "SSG 08", "Galil AR", "AUG", "FAMAS", "SG 553", "SCAR-20", "G3SG1"]
  const pistolTypes = ["CZ-75 Auto", "Desert Eagle", 'Dual Berettas', 'Five-SeveN', 'Glock-18', 'P2000', 'P250', 'R8 Revolver', 'Tec-9', 'USP-S']
  const smgTypes = ['MAC-10', 'MP5-SD', 'MP7', 'MP9', 'P90', 'PP-Bizon', 'UMP-45']
  const heavyTypes = ['MAG-7', 'Nova', 'Sawed-Off', 'XM1014', 'M249', 'Negev']
  const gloveTypes = ['Hand Wraps', 'Moto Gloves', 'Specialist Gloves', 'Sport Gloves', 'Bloodhound Gloves', 'Hydra Gloves', 'Broken Fang Gloves', 'Driver Gloves']
  const containTypes = ['Weapon Case', 'Sticker Capsule', 'Souvenir Package', 'Pins Capsule', 'Patch Pack', 'Graffiti Box']
  const agentTypes = ['T', 'CT']
  const stickerTypes = ['Holo', 'Foil', 'Glitter', 'Gold', 'Lenticular', 'Paper']
  const otherTypes = ['Case Key', 'Patch', 'Graffiti', 'Collectible', 'Pass', 'Music Kit']

  const filterTypes = 
  [
    ["Knife", knifeTypes],
    ["Rifle", rifleTypes],
    ["Pistol", pistolTypes],
    ["SMG", smgTypes],
    ["Heavy", heavyTypes],
    ["Gloves", gloveTypes],
    ["Container", containTypes],
    ["Agent", agentTypes],
    ["Sticker", stickerTypes],
    ["Other", otherTypes]
  ]
  
  return (
    <div className={`bg-gradient-to-br from-cyan-700 to-sky-600 flex ${trade ? 'flex-col w-1/3 mt-6' : `h-64`}`}>
      <div className={`flex items-center mx-4 ${trade ? `flex-col` : `space-x-6 items-center`}`}>
        {/* Contains search bar, souvenir/stattrak/rarity buttons */}
        <div className={`flex flex-col py-2 ${trade ? <></> : `w-1/2`}`}>
          {/* Search bar */}
          <input className="h-12 bg-white text-gray-600 py-1 px-4 rounded-full focus:outline-none my-2"
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
          <RarityFilter trade={trade}/>
        </div>
        <WearButtons handleAnyClick={handleWearClick} wearState={wearState} />
      </div>
      {/* Gun Type buttons */}
      <div className={`relative flex mt-10 mx-8  ${trade ? `flex-wrap w-5/6 justify-around` : `flex flex-row justify-between w-full`} `}>
        {filterTypes.map((type) => (
          <TypeButton itemType={type[0]} types={type[1]} handleTypeClick={handleTypeClick} trade={trade}/>
        ))}
      </div>
    </div>
  );
}

function TypeButton({itemType, types, handleTypeClick, trade}) {
  const firstHalfOfTypes = types.slice(0, Math.ceil(types.length / 2));
  const secondHalfOfTypes = types.slice(Math.ceil(types.length / 2));
  return (
    {trade ?
    <div className="group">
      <div
        className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] flex justify-center drop-shadow-lg rounded-sm px-2 py-1 my-1 cursor-pointer text-white h-12 w-20"
        onClick={() => handleTypeClick(itemType)}
      >
        <p className="my-auto">{itemType}</p>
      </div>
       <div className={`hidden group-hover:flex flex-wrap absolute left-0 w-full rounded-sm ${trade ? `p-2 bg-sky-600 z-10` : <></>}`}>
        {types.map((type: boolean | React.Key | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.PromiseLikeOfReactNode | null | undefined) => (
          <div className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg flex justify-center rounded-sm px-3 py-1 mr-2 my-1 cursor-pointer text-xs text-white h-10 w-28"
           key={type} 
           onClick={() => handleTypeClick(type)}>
            <p className="my-auto">{type}</p>
          </div>
        ))}
      </div>
    </div> : 
    <div className="group flex-grow mx-1 h-20">
     <div
        className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] flex flex-grow justify-center drop-shadow-lg rounded-sm py-1 cursor-pointer text-white h-20"
        onClick={() => handleTypeClick(itemType)}
      >
        <p className="my-auto">{itemType}</p>
      </div>
      <div className="hidden group-hover:flex w-full rounded-sm absolute left-0 flex-col">
        <div className="flex flex-grow">
          {firstHalfOfTypes.map((type) => (
            <div
              className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg flex flex-grow justify-center rounded-sm px-2 py-1 mx-1 mt-2 cursor-pointer text-xs text-white h-12 w-28"
              key={type}
              onClick={() => handleTypeClick(type)}
            >
              <p className="my-auto">{type}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-grow">
          {secondHalfOfTypes.map((type) => (
            <div
              className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg flex flex-grow justify-center rounded-sm px-2 py-1 mx-1 mt-2 cursor-pointer text-xs text-white h-12 w-28"
              key={type}
              onClick={() => handleTypeClick(type)}
            >
              <p className="my-auto">{type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SouvenirFilter({ onClick, souvenirState }) {
  const buttonClassNames = [
    "bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] drop-shadow-lg rounded-sm cursor-pointer text-white flex-grow py-2",
    "bg-yellow-400 hover:bg-yellow-300 hover:scale-[1.025] drop-shadow-lg rounded-sm cursor-pointer text-white flex-grow py-2",
    "bg-zinc-800 hover:bg-zinc-700 hover:scale-[1.025] drop-shadow-lg rounded-sm cursor-pointer text-white flex-grow py-2",
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

function RarityFilter({trade}){
  return (
    <div className="relative group">
      <div className="bg-sky-700 drop-shadow-lg rounded-sm cursor-pointer text-white flex items-center justify-center py-4 my-2">
        Rarity
      </div>
      <div className={`hidden group-hover:flex ${trade ? <></> : `absolute top-full`} w-full bg-white border rounded-sm shadow-md`}>
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
    setSelectedItems((prevSelectedItems: string) => {
      const itemIndex = wearItems.indexOf(itemName);
      const newSelectedItems = prevSelectedItems.split('').map((value, index) =>
        index === itemIndex ? (value === '1' ? '0' : '1') : value
      );
      const newSelectedString = newSelectedItems.join('');
      handleAnyClick(newSelectedString); // Invoke handleAnyClick after state update
      return newSelectedString;
    });
  };
  

  const handleOnly = (itemName: string) => {
    const newSelectedItems = wearItems.map((item) => (item === itemName ? '1' : '0')).join('');
    setSelectedItems(newSelectedItems);
    handleAnyClick(newSelectedItems);
  };

  return (
    <div className="bg-sky-700 rounded p-2 flex flex-col items-start w-64 my-5">
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
