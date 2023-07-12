import PriceData from './skinPrices.json';

// Edits prices json so that only valid items will
// remain as keys in the json
export default function RemoveBadItems(){
    const badItems = GetBadItems();

    for (var badItem in badItems){
        for (item in PriceData){
            if (badItem == item){
                delete PriceData[item];
                continue;
            }
        }
    }
}

function GetBadItems(){
    const fs = require('fs');

    // Read the text file
    fs.readFile('baditems.txt', 'utf8', (err, data) => {
        if (err) { console.log(err); return; }
        const lines = data.split('\n');
        const nonEmptyLines = lines.filter(line => line.trim() !== '');

        return nonEmptyLines;
    });
}