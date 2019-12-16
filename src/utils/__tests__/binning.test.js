/* eslint-env jest */
import { mapAttributeValuesToLevel } from '../binning'

describe('binning', () => {
  it('calculates levels', () => {
    const levels = mapAttributeValuesToLevel({
      capacity: {
        value: 1
      },
      weight: {
        value: 900,
        units: 'kg'
      },
      speed: {
        value: 0,
        units: 'km/h'
      },
      footprint: {
        value: 8.4,
        units: 'm²'
      },
      emissions: {
        value: 0
      },
      health: {
        value: 1
      }
    })

    expect(levels).toEqual({
      emissions: 1,
      footprint: 4,
      health: 4,
      speed: 1,
      weight: 3
    })
  })

  it('returns null if called with no value', () => {
    const levels = mapAttributeValuesToLevel(undefined)

    expect(levels).toEqual(null)
  })
})
