import axios from 'axios'

export default function LoadInventory(/*steamid*/){
  let steamid = '76561198186248643'; // sample steam id
  const url1 = 'http://steamcommunity.com/inventory/';
  const url2 = '/730/2?l=english&count=2000';
  const url = url1 + steamid + url2;

  axios.get(url)
  .then((getResponse) => {
    // console.log("\n\n\nSTART OF DATA\n\n\n");
    // console.log(getResponse.data);
    // console.log("\n\n\nEND OF DATA\n\n\n");
    data = getResponse.data;
    return data;
  })
  .catch(err=>console.log("\n\n\nloadinventory.js: " + err + "\n\n\n"))
}