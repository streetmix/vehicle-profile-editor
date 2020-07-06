import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment } from 'semantic-ui-react'
import { calculateDriverLevelRequired } from '../../utils/driversLicense'
import { calculateOperatingLevelRequired } from '../../utils/operatingLicense'
import { calculateDataLevelRequired } from '../../utils/dataRequirement'
import { calculatePriceRequired } from '../../utils/priceToUse'
import { calculateSpaceRequired } from '../../utils/spaceAllocation'
import { calculateSubsidyRequired } from '../../utils/subsidy'
import VehicleImage from './VehicleImage'
import RadarChart from './RadarChart'
import SummaryPolicy from './SummaryPolicy'
import i18n from '../../i18n'
ResultOptions.propTypes = {
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
  useCase: PropTypes.objectOf(PropTypes.string),
  levels: PropTypes.objectOf(PropTypes.number)
}

function ResultOptions ({ levels, useCase, vehicle }) {
  // const { t } = useTranslation()

  if (!levels) return null

  // Require ALL dependent variables to be set
  const allValues = Object.values(levels)
  if (allValues.includes(0)) {
    return null
  }

  return (
    <div className="box">
      <Grid>
        <Grid.Row columns={3}>
          <Grid.Column width={6}>
            {vehicle.name}
            <VehicleImage vehicle={vehicle} />
          </Grid.Column>
          <Grid.Column width={3} />
          <Grid.Column width={6}>
            <RadarChart levels={levels} />
          </Grid.Column>
        </Grid.Row>

        {calculateDriverLevelRequired(levels, useCase)}
        {calculateOperatingLevelRequired(levels, useCase)}
        {calculateDataLevelRequired(levels)}
        {calculatePriceRequired(levels, useCase)}
        {calculateSubsidyRequired(levels, useCase)}
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Segment basic textAlign="center">
              {i18n.t('resultOptions.streetAllocation')}
            </Segment>
          </Grid.Column>
        </Grid.Row>
        {calculateSpaceRequired(levels)}
      </Grid>
      <SummaryPolicy levels={levels} />

    </div>
  )
}

export default ResultOptions
