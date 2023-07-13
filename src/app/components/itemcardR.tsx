import SetPrice from '../helpers/prices/setprice.js';
import RandomSkin from '../helpers/randomskin.js';

export default async function ItemcardRandom() {
    const randomItem = await RandomSkin();
    const name = randomItem.itemName;
    const icon = randomItem.itemIcon;
    const price = SetPrice(name);

    return (
        <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-74 h-60">
            <div className="flex flex-col p-3">
                <h3>{name}</h3>
                <p className="text-xs">Steam Price: {price.steam} {price.recency}</p>
                <p className="text-xs">Buff price: {price.buff}</p>
            </div>
            <img className="mx-auto object-contain w-32 h-32" src={icon} alt={name} />
        </div>
    );
}