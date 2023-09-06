// Import the Nav component from '../components/nav' to use it later in the page.
// The next few lines import necessary dependencies for the component to function properly.
"use client"
import Nav from '../components/nav';
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { initDB, initFirebase } from "../fb/config";
import { useRouter } from 'next/navigation';
import Tradecard from '../components/tradecard';
import { PlusIcon } from "@heroicons/react/24/solid"; // Import the PlusIcon from Hero Icons
import ItemFilter from '../components/itemfilter';

// Initialize Firebase
initFirebase();
const db = initDB(); // Initialize the Firebase database.

// Define the main functional component 'TradesPage'.
export default function TradesPage() {
  // Get the authentication instance and router object.
  const auth = getAuth();
  const router = useRouter();

  // Set up state variables for the component.
  const [user] = useAuthState(auth); // 'user' stores the current authenticated user, if any.
  const [trades, setTrades] = useState([]); // 'trades' holds the list of trades fetched from Firestore.
  const [offerFilters, setOfferFilters] = useState([]); // 'offerFilters' keeps track of selected offer filters.
  const [requestFilters, setRequestFilters] = useState([]); // 'requestFilters' stores selected request filters.
  // State variable to track the loading state
  const [isLoading, setIsLoading] = useState(false);

  // Filter the trades based on selected filters.
  const filteredTrades = trades.filter((trade) => {
    const reqs = trade.requested_items;
    const offers = trade.offered_items;
    const bothEmpty = (requestFilters.length == 0 && offerFilters.length == 0)

    // Check if any requested item matches the selected request filters.
    var reqFilter = false;
    for (let i = 0; i < reqs.length; i++) {
      if(requestFilters.includes(reqs[i].category) || bothEmpty) {
        reqFilter = true;
      }
    }

    // Check if any offered item matches the selected offer filters.
    var offFilter = false;
    for (let i = 0; i < offers.length; i++) {
      if(offerFilters.includes(offers[i].category) || bothEmpty) {
        offFilter = true;
      }
    }

    // Return true if either request filter or offer filter matches.
    return reqFilter || offFilter;
  });

  // useEffect hook to load trades data from Firestore when the component mounts.
  useEffect(() => {
    const loadTrades = async () => {
      const tradesCollection = collection(db, "trades");
      const tradesSnapshot = await getDocs(tradesCollection);
      const tradesData = tradesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrades(tradesData);
    };

    loadTrades();
  }, []);

  // Function to handle the deletion of a trade.
  const handleDeleteTrade = async (tradeId) => {
    try {
      // Get a reference to the trade document.
      const tradeRef = doc(db, "trades", tradeId);
      
      // Delete the trade document from Firestore.
      await deleteDoc(tradeRef);

      // Update the state to remove the deleted trade from the page in real-time.
      setTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== tradeId));
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  // Function to navigate to the 'create-trade' page.
  const handleCreateTrade = () => {
    setIsLoading(true);
    router.push("/create-trade");
  };

  // Function to update the offer filters based on user selection.
  const updateOfferFilter = (filter) => {
    const oldFilters = [...offerFilters]; // Create a new array instance
    if (oldFilters.includes(filter)) {
      oldFilters.splice(oldFilters.indexOf(filter), 1); // Remove the filter if already selected.
    } else {
      oldFilters.push(filter); // Add the filter if not already selected.
    }
    setOfferFilters(oldFilters);
  };

  // Function to update the request filters based on user selection.
  const updateRequestFilter = (filter) => {
    const oldFilters = [...requestFilters]; // Create a new array instance
    if (oldFilters.includes(filter)) {
      oldFilters.splice(oldFilters.indexOf(filter), 1); // Remove the filter if already selected.
    } else {
      oldFilters.push(filter); // Add the filter if not already selected.
    }
    setRequestFilters(oldFilters);
  };

  // Render the component's UI.
  return (
    <>
      {/* Render the Nav component */}
      <Nav></Nav>
      <div className='flex flex-row m-2'>
        <ItemFilter trade={true}></ItemFilter>
        <div className='mr-3 pl-6 w-full relative'>
          {/* Render the "Create Trade" button if a user is authenticated */}
          {user && (
            <button
              className={`bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-yellow-800 
              font-bold text-lg py-4 px-8 rounded shadow-lg fixed bottom-8 right-9 z-10 ${
                isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
              }`}
              onClick={handleCreateTrade}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-blue-900 rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">
                    <PlusIcon className="w-5 h-5 inline-block -mt-1" />
                  </span>
                  Create Trade
                </>
              )}
            </button>
          )}
          <div className='flex flex-col px-2 items-start w-full pb-16 h-[850px] overflow-y-auto snap-y'>
            {/* Render Trade cards based on filtered trades */}
            {trades[0] ? filteredTrades.map((trade) => (
              <Tradecard 
              key={trade.id}
              owner={trade.owner_steam.steam_name} 
              owner_url={trade.owner_steam.steam_url} 
              offers={trade.offered_items} 
              requests={trade.requested_items} 
              id={trade.id}
              is_owner={user?.uid == trade.owner}
              onDeleteTrade={handleDeleteTrade}/>
            )) : <p>Loading</p>}
          </div>
        </div>
      </div>
    </>
  );
}