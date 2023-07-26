import PropTypes from 'prop-types';
import { initDB, initFirebase } from "../fb/config";
import { doc, collection, deleteDoc } from "firebase/firestore";
import Itemcard from './itemcard';
import SetPrice from '../helpers/prices/setprice';
import { useState, MouseEvent, useCallback } from "react";

initFirebase();
const db = initDB();

const TradeCard = ({ owner, owner_url, offers, requests, is_owner, id, onDeleteTrade }) => {
  const handleDelete = async () => {
    try {
      // Get the reference to the "trades" collection
      const tradesRef = collection(db, 'trades');

      // Delete the trade document with the given ID
      await deleteDoc(doc(tradesRef, id));

      // The trade has been successfully deleted
      console.log('Trade deleted successfully.');
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
      throttle((e: MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = (y - centerY) / 1000;
      const rotateY = (centerX - x) / 1000;

      setRotate({ x: rotateX, y: rotateY });
      }, 100),
      []
  );

  const onMouseLeave = () => {
      setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="bg-gradient-to-br from-cyan-700 to-sky-600 my-6 flex flex-col relative w-full shadow-lg shadow-sky-600/50"
    onMouseMove={onMouseMove}
    onMouseLeave={onMouseLeave}
    style={{
      transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
      transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
    }}>
      <div className="p-2 mt-2">
        <h1 className="text-white text-xl">Trade Owner: <a className='hover:underline' href={owner_url}>{owner}</a></h1>
      </div>
      <div className="flex flex-row justify-between divide-x-2 divide-sky-950">
        <Section title="Offering" items={offers} />
        <Section title="Requesting" items={requests} />
      </div>
      
        {is_owner ? 
        <div className=" flex justify-end border-t-2 border-sky-950">
          <button onClick={() => onDeleteTrade(id)} className="bg-red-500  hover:bg-red-600 my-2 mr-2 rounded-md text-white font-semibold py-1 px-2">Delete</button>
        </div>
        : <></>}
      
    </div>
  );
};

const Section = ({ title, items }) => {
  return (
    <div className="mt-2 p-3 border-t-2 border-sky-950 min-h-[336px] w-1/2">
      <h1 className="text-white tracking-wide text-lg font-bold mb-2">{title}:</h1>
      <h4 className='text-sm'>Total Buff Price: ${getTotal(items)}</h4>
      <div className="flex flex-wrap -mx-2">
        {items.map((item, index) => (
          <Itemcard key={index} itemData={item} />
        ))}
      </div>
    </div>
  );
};

function getTotal(items) {
  var total = 0;
  for(var i = 0; i < items.length; i++) {
    const priceData = SetPrice(items[i].itemName);
    total += Number(priceData.buff.substring(1));
  }
  return total.toFixed(2);
}

TradeCard.propTypes = {
  user: PropTypes.string.isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  requests: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

export default TradeCard;
