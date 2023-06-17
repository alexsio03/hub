export default function LoadInventory(/*steamid*/){
    let steamid = 76561198186248643;
    const Http = new XMLHttpRequest();
    // Placeholder using POP AWP Factory New
    const url1 = 'https://steamcommunity.com/profiles/';
    const url2 = '/inventory/json/730/2';
    const url = url1 + steamid + url2;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            let inventoryData = Http.responseText;
            let test = inventoryData['success'];
        }
    }
}