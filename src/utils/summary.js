/**
 * The primary purpose of this framework is to show people how “bad” a vehicle
 * is, which is guided by the relative size of the radar chart polygon. NUMO
 * has asked us to consider summarizing the vehicle's relative harm by
 * measuring the polygon's area.
 *
 * However, it will be difficult to normalize the area of the polygon (even if
 * it were calculable), because the polygon renders at different sizes and the
 * curves used to connect the points (the normal behavor of react-d3-radar) are
 * visual only -- they don't mean anything. Thus, "area of the polygon" is not
 * an effective way to summarize the vehicle's overall impact.
 *
 * Instead, a much better way to create a summarize statistic is to use an
 * average of each attribute's level. This means it is no longer tied to the
 * visual representation of each level.
 *
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @returns {Number} - or `null` if average cannot be calculated
 */
export function calculateSummaryIndicator (levels) {
  const array = Object.values(levels).filter(Number.isFinite)

  if (array.length > 0) {
    const sum = array.reduce((a, b) => a + b, 0)
    const average = sum / array.length
    return average
  }

  return null
}
