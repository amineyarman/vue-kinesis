import getCoordinates from './getCoordinates';

export default function (action) {
  const { event, target } = action;
  const x = event.gamma / 45;
  const y = event.beta / 90;

  return {
    ...getCoordinates(x, y),
    target,
  };
}
