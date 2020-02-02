import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Header,
  Dropdown,
  Button,
  Icon,
  Input,
  Message
} from 'semantic-ui-react'
import find from 'lodash/find'
import DataInput from './DataInput'
import { getNewVehicleId } from '../../utils/uniqueid'
import { fetchData, saveData } from '../../utils/gsheets'
import ATTRIBUTES from '../../data/attributes_numo.json'
// import VEHICLE_PROFILES from '../../data/vehicle_profiles.json'

function Attributes ({ values = {}, onChange = () => {} }) {
  return ATTRIBUTES.map(attribute => (
    <DataInput
      key={attribute.id}
      attribute={attribute}
      value={values[attribute.id]}
      onChange={value => {
        onChange({ ...values, [attribute.id]: value })
      }}
    />
  ))
}

InputPanel.propTypes = {
  vehicle: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    attributes: PropTypes.objectOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        units: PropTypes.string
      })
    )
  }),
  setVehicle: PropTypes.func
}

function InputPanel ({ vehicle, setVehicle }) {
  // const [profiles, setProfiles] = useState(VEHICLE_PROFILES)
  const [profiles, setProfiles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())
  const [isSavePending, setSavePending] = useState(false)
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)

  useEffect(() => {
    async function fetchVehicleProfiles () {
      setLoadingProfiles(true)

      try {
        const profiles = await fetchData()
        setProfiles(profiles)
      } catch (err) {
        console.error(err)
        setError(err.message)
      }

      setLoadingProfiles(false)
    }

    fetchVehicleProfiles()
  }, [lastUpdate])

  function handleSaveProfile (event) {
    const clone = {
      ...vehicle,
      id: getNewVehicleId(),
      name: `${vehicle.name}`
    }
    setVehicle(clone)
    saveToApi('POST', clone)
  }

  // async function updateToApi () {
  //   saveToApi('PUT', vehicle)
  // }

  async function saveToApi (method, vehicle) {
    setSuccess('')
    setError('')
    setSavePending(true)

    try {
      const result = await saveData('POST', vehicle)
      if (!result) return
      setLastUpdate(new Date().toISOString())
      setSuccess('Saved vehicle to google sheets.')
    } catch (err) {
      console.error(err)
      setError('Unable to save vehicle profile.')
    }

    setSavePending(false)
  }

  function handleAttributesChange (attributes) {
    setVehicle({
      ...vehicle,
      attributes
    })
  }

  function handleDropdownChange (event, data) {
    const vehicle = find(profiles, { id: data.value })

    setVehicle(vehicle)

    // Reset error state.
    setSuccess('')
    setError('')
  }

  function handleNameChange (event, data) {
    const newVehicle = {
      ...vehicle,
      name: event.target.value
    }

    // Delete the vehicle image on name change so that
    // edited vehicles don't end up with the wrong image
    if (Object.prototype.hasOwnProperty.call(newVehicle, 'image')) {
      delete newVehicle.image
    }

    setVehicle(newVehicle)
  }

  return (
    <div className="box">
      <Header as="h3" dividing>
        Input vehicle attributes
      </Header>

      <p>
        Please choose from the drop-down menu at the bottom or input specific
        vehicle attributes.
      </p>

      <div className="input-row">
        <Dropdown
          className="icon"
          id="presets"
          placeholder={
            isLoadingProfiles
              ? 'Retrieving profiles...'
              : 'Select pre-loaded vehicle'
          }
          fluid
          search
          selection
          value=""
          loading={isLoadingProfiles}
          options={profiles.map(item => ({
            key: item.id,
            text: item.name,
            value: item.id
          }))}
          onChange={handleDropdownChange}
        />
      </div>

      <div className="input-row">
        <label htmlFor="input-name">Vehicle name (optional)</label>
        <Input
          id="input-name"
          value={vehicle && vehicle.name}
          placeholder="My vehicle"
          onChange={handleNameChange}
        />
      </div>

      <Attributes
        values={vehicle && vehicle.attributes}
        onChange={handleAttributesChange}
      />

      <Button
        fluid
        color="green"
        icon
        labelPosition="left"
        onClick={handleSaveProfile}
        disabled={isSavePending || (vehicle && !vehicle.name)}
      >
        {isSavePending ? (
          <>
            <Icon loading name="spinner" />
            Saving ...
          </>
        ) : (
          <>
            <Icon name="save" />
            Save profile
          </>
        )}
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

      {error && <Message error>{error}</Message>}
      {success && <Message success>{success}</Message>}
    </div>
  )
}

export default InputPanel
