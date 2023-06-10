import data from '../skin-info/skins.json';

export default function RandomSkin(){
    const randomSkin = Math.floor(Math.random()*1713);
    // 1713 is total skins in CSGO, found by this calc:
    // (Lines in src\app\skin-info\skins.json - 2)/13
    const itemToDisplay = data[randomSkin];
    const itemMinFloat = itemToDisplay.min_float;
    const itemMaxFloat = itemToDisplay.max_float;
    const floatRange = itemMaxFloat - itemMinFloat;
    const rf = itemMinFloat + Math.random()*floatRange;
    let rw = "";

    if (rf < 0.07){
        rw = "(Factory New)";
    } else if (rf >= 0.07 && rf < 0.15){
        rw = "(Minimal Wear)";
    } else if (rf >= 0.15 && rf < 0.38){
        rw = "(Field-Tested)";
    } else if (rf >= 0.38 && rf < 0.45){
        rw = "(Well-Worn)";
    } else {
        rw = "(Battle-Scarred)";
    }

    return {
        'RandomSkin': randomSkin,
        'RandomWear': rw
    };
}