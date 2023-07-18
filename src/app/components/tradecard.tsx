import PropTypes from 'prop-types';

import Itemcard from './itemcard';
import SetPrice from '../helpers/prices/setprice';

const TradeCard = ({ owner, owner_url, offers, requests }) => {
  return (
    <div className="bg-[#2b2222] rounded-lg my-6 p-1 flex flex-col mx-auto">
      <div className="p-2">
        <h1 className="text-white text-2xl">Trade Owner: <a className='hover:underline' href={owner_url}>{owner}</a></h1>
      </div>
      <div className="flex flex-row">
        <Section title="Offering" items={offers} />
        <Section title="Requesting" items={requests} />
      </div>
    </div>
  );
};

const Section = ({ title, items }) => {
  return (
    <div className="bg-[#452427] mx-2 my-3 p-4 rounded-xl">
      <h1 className="text-white text-lg font-bold mb-2">{title}:</h1>
      <h4>Total Buff Price: ${getTotal(items)}</h4>
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
  return total.toPrecision(3);
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

export default TradeCard;
