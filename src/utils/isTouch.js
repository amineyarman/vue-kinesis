export default function isTouch() {
  return /Mobi|Android/i.test(navigator.userAgent);
}
