import getCoordinates from './getCoordinates';

export default function (element) {
  return getCoordinates(
    element ? element.width / 2 : 0,
    element ? element.height / 2 : 0,
  );
}
