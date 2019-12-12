import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'semantic-ui-react'
import './VehicleImage.css'

VehicleImage.propTypes = {
  vehicle: PropTypes.shape({
    image: PropTypes.string,
    text: PropTypes.string
  })
}

function VehicleImage ({ vehicle }) {
  if (!vehicle.image) return null

  return (
    <Image
      src={`/images/${vehicle.image}`}
      alt={`Image: ${vehicle.text}`}
      bordered
      fluid
      rounded
      className="vehicle-image"
    />
  )
}

export default VehicleImage
