import getCoordinates from './getCoordinates'
import clamp from './clamp'

export default function (action) {
  const {
    y, x, target, originX = 50, strength = 10, event = null, minX, minY, maxX, maxY,
  } = action

  let { originY = 50, } = action

  if (event === 'scroll') {
    originY = -originY / 2
  }

  const movementX = clamp(
    (x - originX / 50) * strength,
    minX,
    maxX
  )
  const movementY = clamp(
    (y - originY / 50) * strength,
    minY,
    maxY
  )

  return {
    ...getCoordinates(movementX, movementY),
    target,
  }
}
