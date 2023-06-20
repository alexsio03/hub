export default function LoadInventory(/*steamid*/){
  let steamid = '76561198186248643'; // wak steam id
  const url1 = 'http://steamcommunity.com/profiles/';
  const url2 = '/inventory/json/730/2';
  const url = url1 + steamid + url2;

  axios.get(url)
  .then(data=>{return data.json()})
  .catch(err=>console.log(err))
}