export default function Itemcard(props) {
    return (
        <div className="bg-neutral-900 m-3 p-1 rounded-xl">
            <div className="flex flex-col p-3">
                <h3>{props.itemname}</h3>
                <p className="text-sm">Buff Price: {props.price}</p>
                <p className="text-sm">Steam Price: {props.steamprice}</p>
            </div>
            <img className="object-contain max-w-xs" src={props.img} alt="" />
        </div>
    )
}