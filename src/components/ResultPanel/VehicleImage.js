import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'semantic-ui-react'
import './VehicleImage.css'
import { useTranslation } from 'react-i18next'

VehicleImage.propTypes = {
  vehicle: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string
  })
}

function VehicleImage ({ vehicle }) {
  const { t } = useTranslation()
  if (!vehicle.image) return null

  return (
    <Image
      src={`/images/${vehicle.image}`}
      alt={`${t('description.image')}: ${vehicle.name}`}
      bordered
      fluid
      rounded
      className="vehicle-image"
    />
  )
}

export default VehicleImage
