import data from '../skin-info/skins.json';

export default function Itemcard(item) {
    return (
        <div className="bg-neutral-900 m-3 p-1 rounded-xl w-48 h-60">
            <div className="flex flex-col p-3">
                <h3>{item.name}</h3>
                <p className="text-xs">Buff Price: {item.steamprice}</p>
                <p className="text-xs">Steam Price: {item.price}</p>
            </div>
            <img className="mx-auto object-contain w-32 h-32" src={item.img} alt="" />
        </div>
    )
}