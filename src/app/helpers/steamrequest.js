export default function SteamRequest(skin){
    const Http = new XMLHttpRequest();
    // Placeholder using POP AWP Factory New
    const url='https://steamcommunity.com/market/listings/730/AWP%20%7C%20POP%20AWP%20%28Factory%20New%29/render?start=0&count=1&currency=3&language=english&format=json';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){

        }
    }
}