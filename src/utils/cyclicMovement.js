export default function (cycleData) {
  const {
    referencePosition,
    elementPosition,
    spanningRange,
    cycles,
  } = cycleData;

  const radialPosition = ((referencePosition - elementPosition) * (Math.PI * 2)) / spanningRange;

  const cycle = spanningRange * Math.sin(radialPosition * cycles);

  return cycle / (spanningRange / 2);
}
