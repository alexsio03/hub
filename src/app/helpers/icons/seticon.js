import data from '../wakInv.json'; // Won't be needed once inventory accessing works with loadinventory.js

// Returns large icon if it exists, normal icon otherwise
export default function SetIcon(item){
  const description = data['rgDescriptions'][item];
  return description.icon_url_large || description.icon_url;
}