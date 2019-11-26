import React, { useState, useEffect } from 'react'
import { Grid, Dropdown, Button, Icon, Input } from 'semantic-ui-react'
import Radar from 'react-d3-radar'
import find from 'lodash/find'
import downloadSvg, { downloadPng } from 'svg-crowbar'
import DataInput from './DataInput'
import { convertUnits } from './utils/conversions'
import UNITS from './data/units.json'
import ATTRIBUTES from './data/attributes_numo.json'
import './App.css'

function getNewVehicleId () {
  return (
    'vehicle_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}

function mapAttributeValuesToLevel (attributes) {
  const levels = Object.entries(attributes).reduce((obj, [key, attribute]) => {
    const definition = find(ATTRIBUTES, { id: key })

    const inputValue = Number.parseFloat(
      typeof attribute === 'object' ? attribute.value : attribute
    )

    // Convert to units if they don't match; if no conversion method is found, log it but use default
    let value = inputValue
    if (
      (typeof attribute === 'object'
        ? attribute.units
        : definition.defaultUnit) !== definition.defaultUnit
    ) {
      value = convertUnits(inputValue, attribute.units, definition.defaultUnit)
    }

    let level = 0
    if (definition) {
      const thresholds = definition.thresholds
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

const mapToVehicleProfile = ({
  weight,
  speed,
  footprint,
  emissions,
  health,
  ...others
}) => {
  return {
    attributes: { weight, speed, footprint, emissions, health },
    ...others
  }
}

function App () {
  const [values, setValues] = useState({})
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())
  const [pending, setPending] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState({})
  const url =
    'https://lwh6oxm5db.execute-api.us-east-1.amazonaws.com/dev/vehicles'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(url).catch(err => {
        if (err) {
          console.error(err)
        }
        setError('Unable to fetch vehicle profiles')
      })

      if (!result) return
      const myJson = await result.json()

      const vehicles = myJson.map(mapToVehicleProfile)
      setVehicles(vehicles)
    }
    fetchData()
  }, [lastUpdate])

  async function createToApi () {
    const clone = {
      ...selectedVehicle,
      key: getNewVehicleId(),
      text: `${selectedVehicle.text} copy`,
      value: `${selectedVehicle.text} copy`
    }
    setSelectedVehicle(clone)
    saveToApi('POST', clone)
  }

  async function updateToApi () {
    saveToApi('PUT', selectedVehicle)
  }

  async function saveToApi (method, selected) {
    setPending(true)
    console.log('saving', { values, vehicles })

    if (!selected) {
      console.log('no vehicle selected?')
      return
    }
    const finalVehicle = {
      key: selected.key,
      text: selected.text,
      value: selected.value
    }
    const meta = ['id', 'app:edited', 'save', 'del', '_xml']
    Object.keys(values).forEach(vehicleAttribute => {
      if (meta.includes(vehicleAttribute)) return
      finalVehicle[`attributes${vehicleAttribute}`] = values[vehicleAttribute]
    })
    console.log({ finalVehicle })

    const result = await fetch(url, {
      method,
      body: JSON.stringify({ vehicle: finalVehicle })
    }).catch(err => {
      if (err) {
        console.error(err)
      }
      setError('Unable to save vehicle profile')
      setPending(false)
    })

    if (!result) return
    console.log('!!! yes')
    const { data } = result
    console.log({ data, result })
    setLastUpdate(new Date().toISOString())
    setSuccess('Saved vehicle to google sheets.')
    setPending(false)
  }

  function sendValues (values) {
    setValues(values)
  }

  function handleDropdownChange (event, data) {
    const vehicle = find(vehicles, { key: data.value })
    setValues(vehicle.attributes)
    console.log({ vehicle })
    setSelectedVehicle(vehicle)
  }

  function handleNameChange (event, data) {
    const newVehicle = {
      ...selectedVehicle,
      text: event.target.value,
      value: event.target.value
    }
    console.log({ newVehicle })
    setSelectedVehicle(newVehicle)
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
                  value={selectedVehicle && selectedVehicle.key}
                  options={vehicles.map(item => ({
                    text: item.text,
                    value: item.key
                  }))}
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
                  value={selectedVehicle && selectedVehicle.text}
                  placeholder="My vehicle"
                  onChange={handleNameChange}
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
                      values: mapAttributeValuesToLevel(values)
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

                {!pending && selectedVehicle && selectedVehicle.key && (
                  <Button
                    primary
                    basic
                    icon
                    labelPosition="left"
                    onClick={updateToApi}
                  >
                    <Icon name="download" />
                    Save vehicle attributes
                  </Button>
                )}
                {!pending && selectedVehicle && selectedVehicle.key && (
                  <Button
                    primary
                    basic
                    icon
                    labelPosition="left"
                    onClick={createToApi}
                  >
                    <Icon name="download" />
                    Save as new vehicle
                  </Button>
                )}
                {pending && <div>Updating vehicle data...</div>}
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
        {error && (
          <Grid.Row columns={1}>
            <Grid.Column>
              <h2 className="error">{error}</h2>
            </Grid.Column>
          </Grid.Row>
        )}
        {success && (
          <Grid.Row columns={1}>
            <Grid.Column>
              <h2 className="success">{success}</h2>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </div>
  )
}

export default App
