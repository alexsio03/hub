// Returns large icon if it exists, normal icon otherwise
export default function SetIcon(item) {
  return item.icon_url_large || item.icon_url;
}