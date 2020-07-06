import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Header, Dropdown, Message, Grid } from 'semantic-ui-react'
import find from 'lodash/find'
import { fetchData } from '../../utils/gsheets'
import { useTranslation } from 'react-i18next'
import VehicleImage from './VehicleImage'
import RadarChart from './RadarChart'

import { mapAttributeValuesToLevel } from '../../utils/binning'
import ResultOptions from './ResultOptions'
import { DEFAULT_USE_CASE } from '../../constants'
import { useCases } from '../../utils/useCase'
import downloadSvg, { downloadPng } from 'svg-crowbar'

// import VEHICLE_PROFILES from '../../data/vehicle_profiles.json'

ResultPage.propTypes = {
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

function ResultPage ({ vehicle, setVehicle }) {
  // const [profiles, setProfiles] = useState(VEHICLE_PROFILES)
  const [profiles, setProfiles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const levels = mapAttributeValuesToLevel(vehicle.attributes)
  const useCase = useCases(DEFAULT_USE_CASE)
  const { t } = useTranslation()
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
  })

  function handleDropdownChange (event, data) {
    const vehicle = find(profiles, { id: data.value })

    setVehicle(vehicle)

    // Reset error state.
    setSuccess('')
    setError('')
  }

  return (
    <div className="App">
      <Header as="h3" dividing>
        {t('resultPage.part1')}
      </Header>

      <p>{t('resultPage.part2')}</p>

      <div className="input-row">
        <Dropdown
          className="icon"
          id="presets"
          placeholder={
            isLoadingProfiles ? t('inputPanel.part3') : t('inputPanel.part4')
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

      {/* <div className="input-row">
        <Dropdown
          className="icon"
          id="use"
          placeholder={
            isLoadingProfiles ? t('resultPage.part3') : t('resultPage.part4')
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
        </div> */}

      {error && <Message error>{error}</Message>}
      {success && <Message success>{success}</Message>}

      <ResultOptions levels={levels} useCase={useCase} vehicle={vehicle} />
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
    </div>
  )
}
function saveSVG () {
  downloadSvg(document.querySelector('svg'), 'vehicle_profile')
}

function savePNG () {
  downloadPng(document.querySelector('svg'), 'vehicle_profile')
}

export default ResultPage
