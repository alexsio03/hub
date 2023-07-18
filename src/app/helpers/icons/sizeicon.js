// Returns large icon if it exists, normal icon otherwise
export default function SizeIcon(item) {
  if (item['icon_url_large']){
    return item['icon_url_large']
  }
  return item['item.icon_url'];
}