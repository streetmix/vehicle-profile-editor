import React, { useState } from 'react'
import { Grid, Dropdown, Button, Icon, Input } from 'semantic-ui-react'
import Radar from 'react-d3-radar'
import find from 'lodash/find'
import downloadSvg, { downloadPng } from 'svg-crowbar'
import DataInput from './DataInput'
import UNITS from './data/units.json'
import ATTRIBUTES from './data/attributes_numo.json'
import VEHICLE_PROFILES from './data/vehicle_profiles.json'
import './App.css'

function mapValuesToLevel (values) {
  const levels = Object.entries(values).reduce((obj, [key, value]) => {
    const attribute = find(ATTRIBUTES, { id: key })
    let level = 0
    if (attribute) {
      const thresholds = attribute.thresholds
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

function saveSVG () {
  downloadSvg(document.querySelector('svg'), 'vehicle_profile')
}

function savePNG () {
  downloadPng(document.querySelector('svg'), 'vehicle_profile')
}

function Attributes ({ values, sendValues = () => {} }) {
  return ATTRIBUTES.map(
    ({ id, name, description, definedUnits, defaultUnit, exampleValue }) => (
      <DataInput
        key={id}
        label={name}
        units={
          typeof definedUnits !== 'undefined'
            ? UNITS[definedUnits]
            : defaultUnit
        }
        value={values[id]}
        example={exampleValue}
        description={description}
        onChange={value => {
          sendValues({ ...values, [id]: value })
        }}
      />
    )
  )
}

function App () {
  const [values, setValues] = useState({})
  const [name, setName] = useState('')

  function sendValues (values) {
    setValues(values)
  }

  function handleDropdownChange (event, data) {
    const vehicle = find(VEHICLE_PROFILES, { value: data.value })
    setValues(vehicle.attributes)
    setName(vehicle.text)
  }

  return (
    <div className="App">
      <Grid stackable>
        <Grid.Row columns={1}>
          <Grid.Column>
            <h1>Vehicle profile editor</h1>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={9}>
            <div className="box">
              <div className="input-row" style={{ marginBottom: '1.5em' }}>
                <Dropdown
                  className="icon"
                  id="presets"
                  placeholder="Load vehicle preset (optional)"
                  fluid
                  search
                  selection
                  options={VEHICLE_PROFILES}
                  onChange={handleDropdownChange}
                  style={{
                    margin: 0 /* Override a right margin from Semantic-UI */
                  }}
                />
              </div>
              <div className="input-row">
                <label htmlFor="input-name">Vehicle name (optional)</label>
                <Input
                  id="input-name"
                  value={name}
                  placeholder="My vehicle"
                  onChange={event => setName(event.target.value)}
                />
              </div>
              <Attributes values={values} sendValues={sendValues} />
            </div>
          </Grid.Column>
          <Grid.Column width={7}>
            <div className="box">
              <Radar
                width={500}
                height={500}
                padding={70}
                domainMax={5}
                highlighted={null}
                onHover={point => {
                  if (point) {
                    console.log('hovered over a data point')
                  } else {
                    console.log('not over anything')
                  }
                }}
                data={{
                  variables: [
                    { key: 'weight', label: 'Weight' },
                    { key: 'speed', label: 'Top speed' },
                    { key: 'footprint', label: 'Footprint' },
                    { key: 'emissions', label: 'Emissions' },
                    { key: 'health', label: 'Health' }
                  ],
                  sets: [
                    {
                      key: 'me',
                      label: 'My Scores',
                      values: mapValuesToLevel(values)
                    }
                  ]
                }}
              />
              <div className="download-buttons">
                <Button
                  primary
                  basic
                  icon
                  labelPosition="left"
                  onClick={savePNG}
                >
                  <Icon name="download" />
                  Download image (PNG)
                </Button>
                <Button
                  primary
                  basic
                  icon
                  labelPosition="left"
                  onClick={saveSVG}
                >
                  <Icon name="download" />
                  Download vector image (SVG)
                </Button>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default App
