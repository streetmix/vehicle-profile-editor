import React, { useState, useEffect } from 'react'
import {
  Grid,
  Dropdown,
  Button,
  Icon,
  Input,
  Header,
  Divider,
  Message
} from 'semantic-ui-react'
import find from 'lodash/find'
import DataInput from './DataInput'
import RadarChart from './RadarChart'
import Footer from './Footer'
import ATTRIBUTES from './data/attributes_numo.json'
// import VEHICLE_PROFILES from './data/vehicle_profiles.json'
import './App.css'

function Attributes ({ values, sendValues = () => {} }) {
  return ATTRIBUTES.map(attribute => (
    <DataInput
      key={attribute.id}
      attribute={attribute}
      value={values[attribute.id]}
      onChange={value => {
        sendValues({ ...values, [attribute.id]: value })
      }}
    />
  ))
}

function getNewVehicleId () {
  return (
    'vehicle_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}

function mapToVehicleProfile (row) {
  // Grab every column beginning with the string `attr`
  // To add new attributes, just make a new column in the spreadsheet.
  // The spreadsheet uses column names beginning with `attr_`, but
  // the sheets API conversion process strips out the underscore.
  const ids = Object.keys(row).filter(key => key.startsWith('attr'))

  // For each corresponding attribute id, find the units column (if present)
  // and build an attribute value object
  const attributes = ids.reduce((obj, id) => {
    const name = id.replace(/^attr/, '')
    obj[name] = {
      value: row[id],
      units: row['units' + name] || null
    }
    return obj
  }, {})

  // Return all the attributes, including other properties in the row
  return {
    ...row,
    attributes
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
      text: `${selectedVehicle.text}`,
      value: `${selectedVehicle.text}`
    }
    setSelectedVehicle(clone)
    saveToApi('POST', clone)
  }

  // async function updateToApi () {
  //   saveToApi('PUT', selectedVehicle)
  // }

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
      finalVehicle[`attributes${vehicleAttribute}`] =
        values[vehicleAttribute].value
      finalVehicle[`metrics${vehicleAttribute}`] =
        values[vehicleAttribute].units
    })

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

    setLastUpdate(new Date().toISOString())
    setSuccess('Saved vehicle to google sheets.')
    setPending(false)
  }

  function sendValues (values) {
    setValues(values)
  }

  function handleDropdownChange (event, data) {
    // const vehicle = find(VEHICLE_PROFILES, { value: data.value })
    const vehicle = find(vehicles, { key: data.value })

    setValues(vehicle.attributes)
    setSelectedVehicle(vehicle)

    // Reset error state.
    setSuccess('')
    setError('')
  }

  function handleNameChange (event, data) {
    const newVehicle = {
      ...selectedVehicle,
      text: event.target.value,
      value: event.target.value
    }

    setSelectedVehicle(newVehicle)
  }

  return (
    <div className="App">
      <Grid stackable>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">
              Vehicle profiles
              <Header.Subheader>
                A policy guidance tool by NUMO
              </Header.Subheader>
            </Header>
            <p>
              This platform presents guidance towards the level or
              sustainability of any (existing or hypothetical) vehicle depending
              on its attributes. There are pre-loaded values that you can choose
              to learn the policy implications of existing vehicles, and you can
              also add characteristics for any other vehicle and get a result.
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={9}>
            <div className="box">
              <Header as="h3" dividing>
                Vehicle attributes
              </Header>
              <p>
                Please choose from the drop-down menu at the bottom or input
                specific vehicle attributes.
              </p>
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
              <Grid style={{ marginTop: '1em' }}>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Dropdown
                      className="icon"
                      id="presets"
                      placeholder="Load profile"
                      fluid
                      search
                      selection
                      value=""
                      // options={VEHICLE_PROFILES}
                      options={vehicles.map(item => ({
                        text: item.text,
                        value: item.key
                      }))}
                      onChange={handleDropdownChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Button
                      fluid
                      color="teal"
                      icon
                      labelPosition="left"
                      onClick={createToApi}
                      disabled={
                        pending || (selectedVehicle && !selectedVehicle.text)
                      }
                    >
                      <Icon name="save" />
                      {pending ? 'Saving ...' : 'Save profile'}
                    </Button>
                    {/*
                      <Button
                        primary
                        basic
                        icon
                        labelPosition="left"
                        onClick={updateToApi}
                      >
                        <Icon name="download" />
                        Save as new vehicle
                      </Button>
                    */}
                  </Grid.Column>
                </Grid.Row>
                {(error || success) && (
                  <Grid.Row>
                    <Grid.Column>
                      {error && <Message error>{error}</Message>}
                      {success && <Message success>{success}</Message>}
                    </Grid.Column>
                  </Grid.Row>
                )}
              </Grid>
            </div>
          </Grid.Column>
          <Grid.Column width={7}>
            <div className="box">
              <RadarChart values={values} />
            </div>
          </Grid.Column>
        </Grid.Row>

        {/* Branding / credits. Leave this at the bottom! */}
        <Grid.Row columns={1}>
          <Grid.Column>
            <Divider />
            <Footer />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default App
