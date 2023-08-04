import PriceJSON from './skinPrices.json';

// Parses JSON for steam price and last steam purchase, also finds buff price
export default function SetPrice(itemName){
    const item = PriceJSON[itemName];
    let priceSteam = 'No Data';
    let priceBuff = 'No Data';
    let priceSkinport = 'No Data';
    let priceCSMoney = 'No Data';
    let steamPriceRecency = '(>90d)';


    if (!item) {
      return {
        steam: priceSteam,
        recency: '-1',
        buff: priceBuff
      };
    }

    if (item.steam.last_24h != 0) {
        priceSteam = `$${item.steam.last_24h}`;
        steamPriceRecency = '(24h)';
    } else if (item.steam.last_7d != 0) {
        priceSteam = `$${item.steam.last_7d}`;
        steamPriceRecency = '(7d)';
    } else if (item.steam.last_30d != 0) {
        priceSteam = `$${item.steam.last_30d}`;
        steamPriceRecency = '(30d)';
    } else if (item.steam.last_90d != 0) {
        priceSteam = `$${item.steam.last_90d}`;
        steamPriceRecency = '(90d)';
    }
    
    try {
        priceSkinport = `$${item.skinport.starting_at}`;
    } catch (err) {
        console.log(`\n\nsetprice.js (skinport): ${err}\n\n`);
    }

    // try {
    //     priceCSMoney = `$${item.csmoney.price}`;
    // } catch (err) {
    //     console.log(`\n\nsetprice.js (csmoney): ${err}\n\n`);
    // }

    try {
        priceBuff = `$${item.buff163.starting_at.price}`;
    } catch (err) {
        console.log(`\n\nsetprice.js (buff163): ${err}\n\n`);
    }

    return {
        steam: priceSteam,
        buff: priceBuff,
        skinport: priceSkinport,
        recency: steamPriceRecency
    };
}