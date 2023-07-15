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
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { initDB, initFirebase } from "../fb/config";
import LoadInventory from "../helpers/loadinventory";
import { useRouter } from 'next/navigation';

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

  const handleCreateTrade = () => {
    router.push("/create-trade");
  };

  return (
    <>
      <Nav></Nav>
      <div>
      <h1>All Trades</h1>
      {trades.map((trade) => (
        <div key={trade.id}>
          <p>{trade.description}</p>
          {/* Display trade details */}
        </div>
      ))}
      {user && <button onClick={handleCreateTrade}>Create Trade</button>}
    </div>
    </>
  );
}
