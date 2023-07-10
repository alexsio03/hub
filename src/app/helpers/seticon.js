// Returns large icon if it exists, normal icon otherwise
export default function SetIcon(item){
    if (data['rgDescriptions'][item].icon_url_large == undefined){
      return data['rgDescriptions'][item].icon_url;
    }
    return data['rgDescriptions'][item].icon_url_large;
  }