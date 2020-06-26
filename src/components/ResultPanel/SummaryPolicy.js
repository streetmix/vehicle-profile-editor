import React from 'react'
import PropTypes from 'prop-types'
import { Message } from 'semantic-ui-react'
import { calculateSummaryIndicator } from '../../utils/summary'
import { useTranslation } from 'react-i18next'

SummaryPolicy.propTypes = {
  levels: PropTypes.objectOf(PropTypes.number)
}

function SummaryPolicy ({ levels }) {
  const { t } = useTranslation()
  if (!levels) return null

  // Require ALL dependent variables to be set
  const allValues = Object.values(levels)
  if (allValues.includes(0)) {
    return null
  }

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

  return message
}

export default SummaryPolicy
