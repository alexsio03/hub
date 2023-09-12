"use client"
import React, { useEffect, useState } from 'react';
import Nav from './components/nav';
import { collection, getDocs } from 'firebase/firestore';
import { initDB, initFirebase } from './fb/config';
import Marketcard from './components/marketcard';
import Tradecard from './components/tradecard';

// Initialize Firebase
initFirebase();
const db = initDB(); // Initialize the Firebase database.

export default function Home() {
  const [market, setMarket] = useState<any[]>([]);
  const [marketStartIndex, setMarketStartIndex] = useState(0);
  const [tradeStartIndex, setTradeStartIndex] = useState(0);
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    const loadMarket = async () => {
      const marketCollection = collection(db, "market");
      const marketSnap = await getDocs(marketCollection);
      const marketData = marketSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMarket(marketData);
    };

    loadMarket();
  }, []);

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

  const visibleMarket = [...market.slice(marketStartIndex), ...market.slice(0, marketStartIndex)].slice(0, 5);
  const visibleTrades = [...trades.slice(tradeStartIndex), ...trades.slice(0, tradeStartIndex)].slice(0, 3);

  const handleNextMarket = () => {
    setMarketStartIndex((marketStartIndex + 1) % market.length);
  };

  const handlePreviousMarket = () => {
    const newIndex = (marketStartIndex - 1 + market.length) % market.length;
    setMarketStartIndex(newIndex);
  };

  const handleNextTrade = () => {
    setTradeStartIndex((tradeStartIndex + 1) % trades.length);
  };

  const handlePreviousTrade = () => {
    const newIndex = (tradeStartIndex - 1 + trades.length) % trades.length;
    setTradeStartIndex(newIndex);
  };

  return (
    <>
      <Nav></Nav>
      <div className='flex flex-col h-screen my-6'>
        <div className='flex flex-col h-3/8 mx-16 rounded-md bg-blue-700 bg-opacity-50'>
          <div className='p-4'>
            <a className='tracking-wide text-lg' href="/market">Market {'>'}</a>
            <div className='flex flex-row justify-center overflow-hidden'>
              {market[0] ? (
                <>
                  <button className='z-10' onClick={handlePreviousMarket}>{"←"}</button>
                  {visibleMarket.map((sale, index) => {
                    let scale = 100;
                    let opacity = 100;
                    if (index == 0 || index == 4) {
                      scale = 75;
                      opacity = 50;
                    } else if (index == 1 || index == 3) {
                      scale = 95;
                      opacity = 70;
                    }

                    return (
                      <div
                        className={`scale-${scale} opacity-${opacity}`}
                        key={index}
                      >
                        <Marketcard itemInfo={sale.itemInfo} />
                      </div>
                    );
                  })}
                  <button className='z-10' onClick={handleNextMarket}>{"→"}</button>
                </>
              ) : (
                <p>Loading</p>
              )}
            </div>
          </div>
        </div>
        <div className='flex flex-col mx-16 my-6 rounded-md bg-blue-700 bg-opacity-50'>
          <div className='p-4'>
            <a className='tracking-wide text-lg' href="/trades">Trades {'>'}</a>
            <div className='flex flex-col  overflow-hidden'>
              {market[0] ? (
                <>
                  <button className='z-10' onClick={handlePreviousTrade}>{"↑"}</button>
                  <div className='flex flex-col justify-center scale-75 -p-20 -mt-52 -mb-28 p-20 overflow-auto'>
                    {visibleTrades.map((trade, index) => {
                      let scale = 75;
                      let opacity = 50;
                      let z = 0
                      let middle = ''
                      if (index === 1) {
                        scale = 100;
                        opacity = 100;
                        z = 10
                      }
                      return (
                          <div
                            className={`transform scale-${scale} opacity-${opacity} z-${z} ${middle} min-w-full h-72`}
                            key={index}
                          >
                            <Tradecard 
                              key={trade.id}
                              owner={trade.owner_steam.steam_name} 
                              owner_url={trade.owner_steam.steam_url} 
                              offers={trade.offered_items} 
                              requests={trade.requested_items} 
                              id={trade.id}
                              is_owner={false}
                              onDeleteTrade={() => {return null}}/>
                          </div>
                      );
                    })}
                  </div>
                  <button className='z-10' onClick={handleNextTrade}>{"↓"}</button>
                </>
              ) : (
                <p>Loading</p>
              )}
            </div>
          </div>
        </div>
        <div className='mb-20 h-24'>
          <br></br>
        </div>
      </div>
    </>
  );
}


