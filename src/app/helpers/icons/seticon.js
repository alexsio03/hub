// Returns large icon if it exists, normal icon otherwise
export default function SetIcon(item){
    if (item.icon_url_large == undefined){
      return item.icon_url;
    }
    return item.icon_url_large;
  }