import getCoordinates from './getCoordinates'

export default function (cycleData) {
  const {
    referencePosition,
    shape,
    event,
    cycles,
    strength,
  } = cycleData

  const spanningRangeX = event === 'scroll' ? window.innerWidth : shape.width
  const spanningRangeY = event === 'scroll' ? window.innerHeight : shape.height

  const radialPositionX = ((referencePosition.x - shape.left) * (Math.PI * 2)) / spanningRangeX
  const radialPositionY = ((referencePosition.y - shape.top) * (Math.PI * 2)) / spanningRangeY

  const cycleX = spanningRangeX * Math.sin(radialPositionX * cycles)
  const cycleY = spanningRangeY * Math.sin(radialPositionY * cycles)

  return getCoordinates(
    (cycleX * strength) / (spanningRangeX / 2),
    (cycleY * strength) / (spanningRangeY / 2)
  )
}
