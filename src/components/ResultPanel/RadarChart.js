import React from 'react'
import PropTypes from 'prop-types'
import Radar from 'react-d3-radar'
import ATTRIBUTES from '../../data/attributes_numo.json'
import './RadarChart.css'
import { attributesToChartLabels } from '../../utils/attributesToLabels'

import { useTranslation } from 'react-i18next'

RadarChart.propTypes = {
  levels: PropTypes.objectOf(PropTypes.number)
}

function RadarChart ({ levels }) {
  useTranslation(['translation', 'attributes'])
  return (
    <>
      <Radar
        width={500}
        height={500}
        padding={70}
        domainMax={4}
        highlighted={null}
        data={{
          variables: attributesToChartLabels(ATTRIBUTES),
          sets: [
            {
              key: 'key',
              label: 'Vehicle profile',
              values: levels
            }
          ]
        }}
      />
    </>
  )
}

export default RadarChart
