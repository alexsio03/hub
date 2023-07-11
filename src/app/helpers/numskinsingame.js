import SkinList from '../skin-info/skinPrices.json';

// 23743 as of 6/26/2023, maybe update with priceupdate.js
export default function NumberSkins(){
    let num = 0;
    for (let skin in SkinList){
        num++;
    }
    console.log("\n\n" + num + "\n\n");
}