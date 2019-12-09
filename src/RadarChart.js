import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'
import Radar from 'react-d3-radar'
import downloadSvg, { downloadPng } from 'svg-crowbar'
import { ATTR_TYPE_DEPENDENT } from './constants'
import { mapAttributeValuesToLevel } from './utils/binning'
import ATTRIBUTES from './data/attributes_numo.json'

RadarChart.propTypes = {
  values: PropTypes.object
}

function RadarChart ({ values }) {
  return (
    <>
      <Radar
        width={500}
        height={500}
        padding={70}
        domainMax={4}
        highlighted={null}
        onHover={point => {
          if (point) {
            console.log('hovered over a data point')
          } else {
            console.log('not over anything')
          }
        }}
        data={{
          variables: attributesToChartLabels(ATTRIBUTES),
          sets: [
            {
              key: 'key',
              label: 'Vehicle profile',
              values: mapAttributeValuesToLevel(values)
            }
          ]
        }}
      />
      <div className="download-buttons">
        <Button icon labelPosition="left" onClick={savePNG}>
          <Icon name="download" />
          Download image (PNG)
        </Button>
        <Button icon labelPosition="left" onClick={saveSVG}>
          <Icon name="download" />
          Download vector image (SVG)
        </Button>
      </div>
    </>
  )
}

function attributesToChartLabels (attributes) {
  return attributes
    .filter(attribute => attribute.type === ATTR_TYPE_DEPENDENT)
    .map(attribute => ({
      key: attribute.id,
      label: attribute.name
    }))
}

function saveSVG () {
  downloadSvg(document.querySelector('svg'), 'vehicle_profile')
}

function savePNG () {
  downloadPng(document.querySelector('svg'), 'vehicle_profile')
}

export default RadarChart
