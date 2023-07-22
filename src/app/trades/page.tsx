"use client"
import Nav from '../components/nav';
/*
Flow:
  1. Load user inventory
  2. Load all trades from database
  3. On button press
    1) Display all user's items on one side (redirect to page like cs.money trade)
    2) Display all possible items on other side (search bar)
    3) Show prices on both sides
    4) Submit and add to database
  4. Refresh page
*/

// Import necessary dependencies
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { initDB, initFirebase } from "../fb/config";
import LoadInventory from "../helpers/loadinventory";
import { useRouter } from 'next/navigation';
import Tradecard from '../components/tradecard';

// Initialize Firebase
initFirebase();
const db = initDB();

export default function TradesPage() {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [trades, setTrades] = useState([]);
  const router = useRouter();

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

  return (
    <>
      <Nav></Nav>
      <div className='flex flex-row m-10'>
        <div className='w-3/12 bg-blue-900 bg-opacity-30 p-4 h-96'>
          <p>Filters</p>
        </div>
        <div className='ml-24'>
          {user && <button onClick={handleCreateTrade}>Create Trade</button>}
          <div className='flex flex-col flex-wrap items-start'>
            {trades[0] ? trades.map((trade) => (
              <Tradecard 
              key={trade.id}
              owner={trade.owner_steam.steam_name} 
              owner_url={trade.owner_steam.steam_url} 
              offers={trade.offered_items} 
              requests={trade.requested_items} 
              id={trade.id}
              is_owner={user?.uid == trade.owner}
              onDeleteTrade={handleDeleteTrade}
              data={trade}/>
            )) : <p>Loading</p>}
          </div>
        </div>
      </div>
    </>
  );
}
