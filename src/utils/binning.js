import { parser } from 'mathjs'
import find from 'lodash/find'
import { convertUnits } from './conversions'
import { ATTR_TYPE_DEPENDENT } from '../constants'
import ATTRIBUTES from '../data/attributes_numo.json'

export function mapAttributeValuesToLevel (attributes) {
  const levels = Object.entries(attributes).reduce((obj, [key, attribute]) => {
    const definition = find(ATTRIBUTES, { id: key })

    // Only map dependent variables
    if (definition.type !== ATTR_TYPE_DEPENDENT) {
      return obj
    }

    const inputValue = Number.parseFloat(
      typeof attribute === 'object' ? attribute.value : attribute
    )

    // Bail if not a number
    if (Number.isNaN(inputValue)) {
      return obj
    }

    // Convert to units if they don't match; if no conversion method is found, log it but use default
    // TODO: also use mathjs to do units conversion
    let normalizedValue = inputValue
    if (
      (typeof attribute === 'object'
        ? attribute.units
        : definition.defaultUnit) !== definition.defaultUnit
    ) {
      normalizedValue = convertUnits(
        inputValue,
        attribute.units,
        definition.defaultUnit
      )
    }

    // Run calculation (using mathjs package to calculate) if `calc` is defined
    // Otherwise the input value passes through as-is
    let value
    if (definition.calc) {
      const math = parser()
      math.set('x', normalizedValue)
      value = math.evaluate(definition.calc)
      math.clear()
    } else {
      value = normalizedValue
    }

    let level = 0
    if (definition) {
      const thresholds = definition.thresholds
      for (let i = 0; i < thresholds.length; i++) {
        if (i === 0) {
          // First level lower bound is inclusive
          if (value >= thresholds[i][0] && value <= thresholds[i][1]) {
            level = i + 1
          }
        } else if (i === thresholds.length - 1) {
          // Last level does not have an upper bound
          if (value > thresholds[i][0]) {
            level = i + 1
          }
        } else {
          if (value > thresholds[i][0] && value <= thresholds[i][1]) {
            level = i + 1
          }
        }
      }
    }
    obj[key] = level
    return obj
  }, {})

  return levels
}
