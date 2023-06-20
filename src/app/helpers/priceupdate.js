export default function PriceUpdate(){
    const url = 'prices.csgotrader.app/latest/prices_v6.json';
  
    axios.get(url)
    .then(data=>{return data.json()})
    .catch(err=>console.log(err))
  }