export default function Itemcard(props) {
    return (
        <div className="bg-neutral-900 m-3 p-1 rounded-xl w-48 h-60">
            <div className="flex flex-col p-3">
                <h3>{props.itemname}</h3>
                <p className="text-xs">Buff Price: {props.price}</p>
                <p className="text-xs">Steam Price: {props.steamprice}</p>
            </div>
            <img className="mx-auto object-contain w-32 h-32" src={props.img} alt="" />
        </div>
    )
}