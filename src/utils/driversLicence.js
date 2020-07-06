import { DEFAULT_USE_CASE } from '../constants'
export function calculateDriverLevelRequired (levels, useCase) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (useCase !== DEFAULT_USE_CASE && typeof useCase === 'undefined') {
    counter++
  }
  if (array.length > 0) {
    for (const element of keys) {
      if (
        element === 'weight' ||
        element === 'speed' ||
        element === 'emissions'
      ) {
        if (levels[element] !== 1) {
          counter++
        }
      }
    }
    return counter
  }
  return counter
}
