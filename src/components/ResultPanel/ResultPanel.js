import React from 'react'
import PropTypes from 'prop-types'
import VehicleImage from './VehicleImage'
import SummaryPolicy from './SummaryPolicy'
import RadarChart from './RadarChart'
import { mapAttributeValuesToLevel } from '../../utils/binning'

ResultPanel.propTypes = {
  vehicle: PropTypes.shape({
    image: PropTypes.string,
    text: PropTypes.string
  }),
  values: PropTypes.objectOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      units: PropTypes.string
    })
  )
}

function ResultPanel ({ vehicle, values }) {
  const levels = mapAttributeValuesToLevel(values)

  return (
    <div className="box">
      <VehicleImage vehicle={vehicle} />
      <SummaryPolicy levels={levels} />
      <RadarChart levels={levels} />
    </div>
  )
}

export default ResultPanel
