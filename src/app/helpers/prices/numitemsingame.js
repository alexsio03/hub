import SkinList from './skinPrices.json';

// Counts all items in the prices json
export default function NumberItems(){
    const num = Object.keys(SkinList).length;
    return num;
}