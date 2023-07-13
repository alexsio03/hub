// Refreshes baditems.txt
// Potentially buggy because items are also added on error, so a change in 
// formatting could add tons of skins to baditems.txt
export default async function WriteNullObjects(data) {
  const null_list = [];
  for (const item in data) {
    try {
      if (data[item]["steam"]["last_90d"]){
        continue;
      }
      if (data[item]["steam"]["last_30d"]){
        continue;
      }
      if (data[item]["steam"]["last_7d"]){
        continue;
      }
      if (data[item]["steam"]["last_24h"]){
        continue;
      }
      if (data[item]["bitskins"]){
        continue;
      }
      if (data[item]["lootfarm"]){
        continue;
      }
      if (data[item]["csgotm"]){
        continue;
      }
      if (data[item]["csmoney"]["price"] != 0){
        continue;
      }
      if (data[item]["skinport"]){
        continue;
      }
      if (data[item]["csgotrader"]["price"]){
        continue;
      }
      if (data[item]["csgoempire"]){
        continue;
      }
      if (data[item]["swapgg"]){
        continue;
      }
      if (data[item]["csgoexo"]){
        continue;
      }
      if (data[item]["cstrade"]){
        continue;
      }
      if (data[item]["skinwallet"]){
        continue;
      }
      if (data[item]["buff163"]["starting_at"]){
        continue;
      }
      if (data[item]["buff163"]["highest_order"]){
        continue;
      }
      null_list.push(item);
    } catch (error) {
      null_list.push(item);
    }
  }

  const badItemString = null_list.join("\n");

  const fs = require('fs');
  fs.writeFile('./src/app/helpers/prices/baditems.txt', badItemString, (err) => {
      if (err) throw err;
  });
}