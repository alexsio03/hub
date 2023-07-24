"use client"
import Nav from '../components/nav';
// Import necessary dependencies
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { initDB, initFirebase } from "../fb/config";
import { useRouter } from 'next/navigation';
import Tradecard from '../components/tradecard';
import findItem from '../helpers/findItem'

// Initialize Firebase
initFirebase();
const db = initDB();

export default function TradesPage() {
  const auth = getAuth();
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [trades, setTrades] = useState([]);
  const [offerFilters, setOfferFilters] = useState([]);
  const [requestFilters, setRequestFilters] = useState([]);

  const filteredTrades = trades.filter((trade) => {
    const reqs = trade.requested_items;
    const offers = trade.offered_items;
    const bothEmpty = (requestFilters.length == 0 && offerFilters.length == 0)
    var reqFilter = false;
    for (let i = 0; i < reqs.length; i++) {
      console.log(reqs[i].category)
      console.log(requestFilters)
      if(requestFilters.includes(reqs[i].category) || bothEmpty) {
        reqFilter = true;
      }
    }
    var offFilter = false;
    for (let i = 0; i < offers.length; i++) {
      if(offerFilters.includes(offers[i].category) || bothEmpty) {
        offFilter = true;
      }
    }
    return reqFilter || offFilter
  })

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
  
  const handleDeleteTrade = async (tradeId) => {
    try {
      // Get a reference to the trade document
      const tradeRef = doc(db, "trades", tradeId);
      
      // Delete the trade document from Firestore
      await deleteDoc(tradeRef);

      // Update the state to remove the deleted trade from the page in real-time
      setTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== tradeId));
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const handleCreateTrade = () => {
    router.push("/create-trade");
  };

  const updateOfferFilter = (filter) => {
    const oldFilters = [...offerFilters]; // Create a new array instance
    if (oldFilters.includes(filter)) {
      oldFilters.splice(oldFilters.indexOf(filter), 1);
    } else {
      oldFilters.push(filter);
    }
    setOfferFilters(oldFilters);
  };

  const updateRequestFilter = (filter) => {
    const oldFilters = [...requestFilters]; // Create a new array instance
    if (oldFilters.includes(filter)) {
      oldFilters.splice(oldFilters.indexOf(filter), 1);
    } else {
      oldFilters.push(filter);
    }
    setRequestFilters(oldFilters);
  };

  return (
    <>
      <Nav></Nav>
      <div className='flex flex-row m-4'>
        <div className='w-3/12 mt-6 p-4 bg-blue-900 bg-opacity-30 h-96 rounded-sm'>
          <div className='flex justify-center'>
            <p>Filters</p>
          </div>
          <div className='flex flex-row'>
            <div className='flex flex-col w-1/2 m-2 p-2 bg-blue-600 bg-opacity-30 rounded-sm'>
              <div className='flex justify-center'>
                <p>Offers</p>
              </div>
              <br />
              <div>
                <p>Name</p>
                <br />
                <p>Price</p>
                <br />
                <p>Items:</p>
                <div>
                  <div>
                    <label htmlFor="Knives">Knives</label>
                    <input type='checkbox' onClick={() => updateOfferFilter("Knives")}></input>
                  </div>
                  <div>
                    <label htmlFor="Gloves">Gloves</label>
                    <input type='checkbox' onClick={() => updateOfferFilter("Gloves")}></input>
                  </div>
                  <div>
                    <label htmlFor="Rifles">Rifles</label>
                    <input type='checkbox' onClick={() => updateOfferFilter("Rifles")}></input>
                  </div>
                  <div>
                    <label htmlFor="Pistols">Pistols</label>
                    <input type='checkbox' onClick={() => updateOfferFilter("Pistols")}></input>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col w-1/2 m-2 p-2 bg-blue-600 bg-opacity-30 rounded-sm'>
              <div className='flex justify-center'>
                <p>Requests</p>
              </div>
              <div>
                <br />
                <p>Name</p>
                <br />
                <p>Price</p>
                <br />
                <p>Items:</p>
                <div>
                  <div>
                    <label htmlFor="Knives">Knives</label>
                    <input type='checkbox' onClick={() => updateRequestFilter("Knives")}></input>
                  </div>
                  <div>
                    <label htmlFor="Gloves">Gloves</label>
                    <input type='checkbox' onClick={() => updateRequestFilter("Gloves")}></input>
                  </div>
                  <div>
                    <label htmlFor="Rifles">Rifles</label>
                    <input type='checkbox' onClick={() => updateRequestFilter("Rifles")}></input>
                  </div>
                  <div>
                    <label htmlFor="Pistols">Pistols</label>
                    <input type='checkbox' onClick={() => updateRequestFilter("Pistols")}></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='ml-8 pl-14 w-full'>
          {user && <button onClick={handleCreateTrade}>Create Trade</button>}
          <div className='flex flex-col flex-wrap items-start w-full'>
            {trades[0] ? filteredTrades.map((trade) => (
              <Tradecard 
              user={""}
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
