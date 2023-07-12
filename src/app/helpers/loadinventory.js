import axios from 'axios';

// Loads steam inventory
export default function LoadInventory(/*steamid*/){
  const steamid = '76561198186248643'; // sample steam id
  const url1 = 'http://steamcommunity.com/inventory/';
  const url2 = '/730/2?l=english&count=2000';
  const url = url1 + steamid + url2;

  axios.get(url)
  .then((getResponse) => {
    data = getResponse.data;
    return data;
  })
  .catch(err=>console.log("\n\nERROR IN loadinventory.js: " + err + "\n\n"))
}