export default function isTouch() {
  return 'ontouchstart' in document.documentElement;
}
