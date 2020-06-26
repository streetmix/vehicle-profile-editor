import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'
import Radar from 'react-d3-radar'
import downloadSvg, { downloadPng } from 'svg-crowbar'
import { ATTR_TYPE_DEPENDENT } from '../../constants'
import ATTRIBUTES from '../../data/attributes_numo.json'
import './RadarChart.css'
import i18n from '../../i18n'
import { useTranslation } from 'react-i18next'

RadarChart.propTypes = {
  levels: PropTypes.objectOf(PropTypes.number)
}

function RadarChart ({ levels }) {
  const { t } = useTranslation(['translation', 'attributes'])
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
      <div className="download-buttons">
        <Button icon labelPosition="left" onClick={savePNG} fluid>
          <Icon name="download" />
          {t('description.downloadPNG')}
        </Button>
        <Button icon labelPosition="left" onClick={saveSVG} fluid>
          <Icon name="download" />
          {t('description.downloadSVG')}
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
      label: i18n.t('attributes:' + attribute.name + '.name')
    }))
}

function saveSVG () {
  downloadSvg(document.querySelector('svg'), 'vehicle_profile')
}

function savePNG () {
  downloadPng(document.querySelector('svg'), 'vehicle_profile')
}

export default RadarChart
