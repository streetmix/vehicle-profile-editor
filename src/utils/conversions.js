/**
 *
 * Unit conversions
 */

function logError (from, to) {
  console.warn(
    `Unable to find a conversion factor from "${from}" to "${to}". Returning the original value.`
  )
}

/**
 * Converts a number from one unit to another
 * If a conversion is not possible, the original value is returned.
 * Log an error to console for future reference
 *
 * @param {Number} value - value to convert
 * @param {string} from - given unit
 * @param {string} to - desired unit
 * @returns - new value in the desired unit; or original value if no conversion is found
 */
export function convertUnits (value, from, to) {
  // If no original unit is provided, don't log an error, instead,
  // just pass the value through as-is.
  if (typeof from === 'undefined' || from === null) {
    return value
  }

  switch (from) {
    case 'lb': {
      switch (to) {
        case 'kg': {
          return (value / 2.2046).toFixed(2)
        }
        default: {
          logError(from, to)
          return value
        }
      }
    }
    case 'kg': {
      switch (to) {
        case 'lb': {
          return (value * 2.2046).toFixed(2)
        }
        default: {
          logError(from, to)
          return value
        }
      }
    }
    case 'mph': {
      switch (to) {
        case 'km/h': {
          return (value * 1.609344).toFixed(2)
        }
        default: {
          logError(from, to)
          return value
        }
      }
    }
    case 'km/h': {
      switch (to) {
        case 'mph': {
          return (value / 1.609344).toFixed(2)
        }
        default: {
          logError(from, to)
          return value
        }
      }
    }
    case 'sq. ft.': {
      switch (to) {
        case 'm²': {
          return (value * 0.09290304).toFixed(2)
        }
        default: {
          logError(from, to)
          return value
        }
      }
    }
    case 'm²': {
      switch (to) {
        case 'sq. ft.': {
          return (value / 0.09290304).toFixed(2)
        }
        default: {
          logError(from, to)
          return value
        }
      }
    }
    default:
      logError(from, to)
      return value
  }
}
