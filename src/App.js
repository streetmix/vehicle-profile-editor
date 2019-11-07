import React, { useState, useEffect } from 'react'
import { Grid, Dropdown } from 'semantic-ui-react'
import Radar from 'react-d3-radar'
import find from 'lodash/find'
import DataInput from './DataInput'
import UNITS from './data/units.json'
import ATTRIBUTES from './data/attributes_numo.json'
import VEHICLE_PROFILES from './data/vehicle_profiles.json'
import './App.css'

function handleDropdownChange (event) {
  console.log(event, event.nativeEvent)
}

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

function Attributes ({ sendValues = () => {} }) {
  const [values, setValues] = useState({})

  useEffect(() => {
    sendValues(values)
  }, [values, sendValues])

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
        example={exampleValue}
        onChange={value => {
          const num = Number.parseFloat(value)
          if (!Number.isNaN(num)) {
            setValues({ ...values, [id]: Number.parseFloat(value) })
          }
        }}
      />
    )
  )
}

function App () {
  const [values, setValues] = useState({})

  function sendValues (values) {
    setValues(values)
  }

  return (
    <div className="App">
      <Grid>
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
                  button
                  className="icon"
                  id="presets"
                  text="Load vehicle preset (optional)"
                  icon="bookmark outline"
                  basic
                  fluid
                  search
                  labeled
                  floating
                  options={VEHICLE_PROFILES}
                  onChange={handleDropdownChange}
                />
              </div>
              <Attributes sendValues={sendValues} />
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
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default App
