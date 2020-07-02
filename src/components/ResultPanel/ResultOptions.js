import React from 'react'
import PropTypes from 'prop-types'
import { Message } from 'semantic-ui-react'
import { calculateSummaryIndicator } from '../../utils/summary'
import { calculateDriverLevelRequired } from '../../utils/driversLicence'
import { useTranslation } from 'react-i18next'

ResultOptions.propTypes = {
  useCase: PropTypes.objectOf(PropTypes.string),
  levels: PropTypes.objectOf(PropTypes.number)
}

function DriverLicence (level) {
  const { t } = useTranslation()
  const values = Object.values(level)
  const value = values[0]
  if (value > 1) {
    return <p>{t('resultOptions.driverLicense')}</p>
  }
  return <p>{t('resultOptions.noDriverLicense')}</p>
}

function ResultOptions ({ levels, useCase }) {
  const { t } = useTranslation()
  if (!levels) return null

  // Require ALL dependent variables to be set
  const allValues = Object.values(levels)
  if (allValues.includes(0)) {
    return null
  }
  const driverLicence = calculateDriverLevelRequired(levels, useCase)
  const summary = calculateSummaryIndicator(levels)
  let message = null

  // Render nothing if there's no summary
  if (summary === null) {
    return null
  }

  if (summary >= 3) {
    message = (
      <Message negative>
        <Message.Header>{t('summary.harmfulSum')}</Message.Header>
        <p>{t('summary.harmful')}</p>
      </Message>
    )
  } else if (summary < 3 && summary > 2.2) {
    message = (
      <Message warning>
        <Message.Header>{t('summary.lessHarmfulSum')}</Message.Header>
        <p>{t('summary.lessHarmful')}</p>
      </Message>
    )
  } else if (summary <= 2.2) {
    message = (
      <Message positive>
        <Message.Header>{t('summary.notHarmfulSum')}</Message.Header>
        <p>{t('summary.notHarmful')}</p>
      </Message>
    )
  }

  return (
    <div className="box">
      <DriverLicence level={driverLicence} />
      {message}
    </div>
  )
}

export default ResultOptions
