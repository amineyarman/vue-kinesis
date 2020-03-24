import getCoordinates from './getCoordinates';

export default function (action) {
  const {
    y, x, target, originX = 50, strength = 10, event = null,
  } = action;

  let { originY = 50 } = action;

  if (event === 'scroll') {
    originY = -originY / 2;
  }

  const movementX = (x - originX / 50) * strength;
  const movementY = (y - originY / 50) * strength;

  return {
    ...getCoordinates(movementX, movementY),
    target,
  };
}
