import PropTypes from 'prop-types';

import Itemcard from './itemcard';

const TradeCard = ({ owner, offers, requests }) => {
  return (
    <div className="bg-[#2b2222] rounded-lg my-6 p-1 flex flex-col mx-auto">
      <div className="p-2">
        <h1 className="text-white text-2xl">{owner}</h1>
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
      <div className="flex flex-wrap -mx-2">
        {items.map((itemInformation, index) => (
          <Itemcard key={index} itemInfo={itemInformation} />
        ))}
      </div>
    </div>
  );
};

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
