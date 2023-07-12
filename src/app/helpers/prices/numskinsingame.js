import SkinList from './skinPrices.json';

// 23743 as of 6/26/2023, maybe update with priceupdate.js
export default function NumberSkins(){
    const num = Object.keys(SkinList).length;
    console.log(`\n\n${num}\n\n`);
    return num;
}