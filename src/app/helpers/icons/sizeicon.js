// Returns large icon if it exists, normal icon otherwise
export default function SizeIcon(item) {
  var icon = item.icon_url ? item.icon_url : item.icon_url_large
  return icon;
}