import React from 'react'
import PropTypes from 'prop-types'
import { Message } from 'semantic-ui-react'
import { calculateSummaryIndicator } from './utils/summary'

SummaryPolicy.propTypes = {
  levels: PropTypes.objectOf(PropTypes.number)
}

function SummaryPolicy ({ levels }) {
  const summary = calculateSummaryIndicator(levels)
  let message = null

  if (summary >= 3) {
    message = (
      <Message negative>
        <Message.Header>This vehicle may be very harmful</Message.Header>
        <p>
          Policies should be aimed at reducing its overall risk. Consider
          allocating less space for them while giving preference to others,
          requiring more data from operators, requiring a license to operate, or
          charging high fees to operate.
        </p>
      </Message>
    )
  } else if (summary < 3 && summary > 2.2) {
    message = (
      <Message warning>
        <Message.Header>This vehicle may be harmful</Message.Header>
        <p>
          Policies should be aimed at reducing its overall risk. Consider
          allocating less space for them, requesting some data from operators,
          or charging some fees to operate.
        </p>
      </Message>
    )
  } else if (summary >= 0 && summary <= 2.2) {
    message = (
      <Message positive>
        <Message.Header>
          This vehicle is not likely to be harmful
        </Message.Header>
        <p>
          Policies should be aimed at promoting its use. Consider allocating
          more space to them, don’t request too much data from operators, don’t
          require a license to operate, and consider subsidizing their usage.
        </p>
      </Message>
    )
  }

  return message
}

export default SummaryPolicy
