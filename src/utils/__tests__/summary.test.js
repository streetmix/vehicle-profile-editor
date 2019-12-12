/* eslint-env jest */
import { calculateSummaryIndicator } from '../summary'

describe('summary statistic', () => {
  it('calculates a summary of all levels', () => {
    const summary = calculateSummaryIndicator({
      attribute1: 3,
      attribute2: 4,
      attribute3: 1,
      attribute4: 3
    })

    expect(summary).toEqual(2.75)
  })

  it('returns null if there are no levels to calculate', () => {
    const summary = calculateSummaryIndicator({})
    expect(summary).toEqual(null)
  })

  it('does not calcuate any non-numerical attribute [1]', () => {
    // Pass in a faulty object with a null value
    // The result should be the average of only the two calculable numbers
    const summary = calculateSummaryIndicator({
      attribute1: 1,
      attribute2: 2,
      attribute3: null
    })
    expect(summary).toEqual(1.5)
  })

  it('does not calcuate any non-numerical attribute [2]', () => {
    // Pass in a faulty object with a string value
    // There are no calculable values, so result should be null
    const summary = calculateSummaryIndicator({
      foo: 'bar'
    })

    expect(summary).toEqual(null)
  })
})
