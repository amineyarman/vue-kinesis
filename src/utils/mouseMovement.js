import getCoordinates from './getCoordinates';
import getCenter from './getCenter';

export default function (action) {
  const { target, event } = action;
  const x = event.clientX;
  const y = event.clientY;

  const relativeX = x - target.left;
  const relativeY = y - target.top;

  const center = getCenter(target);

  const mouseMovementX = relativeX / center.x;
  const mouseMovementY = relativeY / center.y;

  return {
    ...getCoordinates(mouseMovementX, mouseMovementY),
    target,
  };
}
