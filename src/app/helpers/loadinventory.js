export default function LoadInventory(/*steamid*/){
    let steamid = 76561198186248643; // wak steam id
    const url1 = 'https://steamcommunity.com/profiles/';
    const url2 = '/inventory/json/730/2';
    const url = url1 + steamid + url2;
  
  // potential other method using params
  // const url = 'https://steamcommunity.com/tradeoffer/new/partnerinventory';
  // const Data = {
  //   partner:steamid,
  //   appid:730,
  //   contextid:2
  // }
  // const params = {
  //   headers:{
  //     "content-type":"application/json; charset=UTF-8"
  //   },
  //   body:Data,
  //   method:"POST"
  // }
  
  fetch(url/*, params*/)
  .then(data=>{return data.json()})
  .then(res=>{console.log(res)})
  .catch(error=>console.log(error))
}