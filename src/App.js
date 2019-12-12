import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import {
  Grid,
  Dropdown,
  Button,
  Icon,
  Input,
  Divider,
  Message
} from 'semantic-ui-react'
import find from 'lodash/find'
import DataInput from './DataInput'
import ResultPanel from './components/ResultPanel/ResultPanel'
import Header from './components/Header'
import Footer from './components/Footer'
import { fetchData, saveData } from './utils/gsheets'
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

function App () {
  const [values, setValues] = useState({})
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())
  const [pending, setPending] = useState(false)
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState({})

  useEffect(() => {
    async function fetchVehicleProfiles () {
      setLoadingProfiles(true)

      try {
        const vehicles = await fetchData()
        setVehicles(vehicles)
      } catch (err) {
        setError(err)
      }

      setLoadingProfiles(false)
    }

    fetchVehicleProfiles()
  }, [lastUpdate])

  function handleSaveProfile (event) {
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

  async function saveToApi (method, vehicle) {
    setSuccess('')
    setError('')
    setPending(true)

    try {
      const result = await saveData('POST', vehicle, values)
      if (!result) return
      setLastUpdate(new Date().toISOString())
      setSuccess('Saved vehicle to google sheets.')
    } catch (err) {
      setError('Unable to save vehicle profile.')
    }

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

    console.log(vehicle)

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
            <Header />
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
                    <Button
                      fluid
                      color="teal"
                      icon
                      labelPosition="left"
                      onClick={handleSaveProfile}
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
                  <Grid.Column>
                    <Dropdown
                      className="icon"
                      id="presets"
                      placeholder={
                        isLoadingProfiles
                          ? 'Retrieving profiles...'
                          : 'Load profile'
                      }
                      fluid
                      search
                      selection
                      value=""
                      loading={isLoadingProfiles}
                      // options={VEHICLE_PROFILES}
                      options={vehicles.map(item => ({
                        text: item.text,
                        value: item.key
                      }))}
                      onChange={handleDropdownChange}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              {error && <Message error>{error}</Message>}
              {success && <Message success>{success}</Message>}
            </div>
          </Grid.Column>
          <Grid.Column width={7}>
            <ResultPanel vehicle={selectedVehicle} values={values} />
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
