import PriceJSON from '../skin-info/skinPrices.json';

// Parses JSON for steam price and last steam purchase, also finds buff price
export default function SetPrice(itemName){
    let priceSteam = "No Data";
    let steamPriceRecency = "0";
    let priceBuff = "No Data";
    for (let skin in PriceJSON){
        if (skin == itemName){
            // Steam pricing
            if (PriceJSON[skin]['steam']['last_24h'] != 0){
                priceSteam = "$" + PriceJSON[skin]['steam']['last_24h'];
                steamPriceRecency = "(24h)";
            } else if (PriceJSON[skin]['steam']['last_7d'] != 0){
                priceSteam = "$" + PriceJSON[skin]['steam']['last_7d'];
                steamPriceRecency = "(7d)";
            } else if (PriceJSON[skin]['steam']['last_30d'] != 0){
                priceSteam = "$" + PriceJSON[skin]['steam']['last_30d'];
                steamPriceRecency = "(30d)";
            } else if (PriceJSON[skin]['steam']['last_90d'] != 0){
                priceSteam = "$" + PriceJSON[skin]['steam']['last_90d'];
                steamPriceRecency = "(90d)";
            } else {
                priceSteam = "Unknown";
                steamPriceRecency = "(>90d)";
            }
            // Buff pricing
            try{
                priceBuff = "$" + PriceJSON[skin]['buff163']['starting_at']['price'];
            } catch(err){
                console.log("\n\nsetprice.js: " + err + "\n\n");
            }
        }
    }
    return {
        steam: priceSteam,
        recency: steamPriceRecency,
        buff: priceBuff
    };
}