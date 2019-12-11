import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Message } from 'semantic-ui-react'
import Radar from 'react-d3-radar'
import downloadSvg, { downloadPng } from 'svg-crowbar'
import { ATTR_TYPE_DEPENDENT } from './constants'
import { mapAttributeValuesToLevel } from './utils/binning'
import ATTRIBUTES from './data/attributes_numo.json'

RadarChart.propTypes = {
  values: PropTypes.object
}

function RadarChart ({ values }) {
  const levels = mapAttributeValuesToLevel(values)
  const summary = calculateSummaryIndicator(levels)

  return (
    <>
      {Object.entries(levels).length > 0 && renderSummaryPolicyText(summary)}
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
              values: levels
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

function calculateSummaryIndicator (levels) {
  const array = Object.values(levels)
  const sum = array.reduce((a, b) => a + b, 0)
  const average = sum / array.length

  return average
}

function renderSummaryPolicyText (summary) {
  if (summary >= 3) {
    return (
      <Message negative>
        <Message.Header>This vehicle is harmful</Message.Header>
        <p>
          Policies should be aimed at reducing its overall risk. Consider
          allocating less space for them while giving preference to others,
          requiring more data from operators, requiring a license to operate, or
          charging high fees to operate.
        </p>
      </Message>
    )
  } else if (summary < 3 && summary > 2.2) {
    return (
      <Message warning>
        <Message.Header>This vehicle may be harmful</Message.Header>
        <p>
          Policies should be aimed at reducing its overall risk. Consider
          allocating less space for them, requesting some data from operators,
          or charging some fees to operate.
        </p>
      </Message>
    )
  } else if (summary <= 2.2) {
    return (
      <Message positive>
        <Message.Header>This vehicle is not harmful</Message.Header>
        <p>
          Policies should be aimed at promoting its use. Consider allocating
          more space to them, don’t request too much data from operators, don’t
          require a license to operate, and consider subsidizing their usage.
        </p>
      </Message>
    )
  }
}

export default RadarChart
