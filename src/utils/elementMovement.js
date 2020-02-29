import getCoordinates from './getCoordinates';

export default function (action) {
  const {
    y, x, target, originX = 50, originY = 50, strength = 10,
  } = action;

  const movementX = (x - originX / 50) * strength;
  const movementY = (y - originY / 50) * strength;

  return {
    ...getCoordinates(movementX, movementY),
    target,
  };
}
