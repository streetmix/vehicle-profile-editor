import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input, Dropdown, Icon, Modal, Button } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import './DataInput.css'

DataInput.propTypes = {
  label: PropTypes.string.isRequired,
  example: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      units: PropTypes.string
    })
  ]),
  // Either a single unit or list of units
  units: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string
      })
    )
  ]).isRequired,
  description: PropTypes.string,
  onChange: PropTypes.func
}

function DataInput (props) {
  const {
    label,
    example,
    value,
    units,
    description,
    onChange = () => {}
  } = props
  const [isModalOpen, setModalOpen] = useState(false)
  const inputValue = typeof value === 'object' ? value.value : value
  const unitsValue =
    (typeof value === 'object' && value.units) || units[0].value
  const id = uniqueId('data-input_')

  function handleInputChange (event) {
    onChange({
      value: event.target.value,
      units: unitsValue
    })
  }

  function handleUnitChange (event, data) {
    onChange({
      value: inputValue,
      units: data.value
    })
  }

  function handleModalOpen (event) {
    setModalOpen(true)
  }

  function handleCloseModal (event) {
    setModalOpen(false)
  }

  return (
    <div className="input-row">
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        value={inputValue}
        error={isInvalidInput(inputValue)}
        label={
          typeof units === 'string' ? (
            { basic: true, content: units }
          ) : (
            <Dropdown
              value={unitsValue}
              options={units}
              selection
              onChange={handleUnitChange}
            />
            // There is a conflicting rule below here
            // eslint-disable-next-line
          )
        }
        labelPosition="right"
        placeholder={`example: ${example}`}
        onChange={handleInputChange}
      />
      <div className="input-help">
        <Icon circular color="teal" name="help" onClick={handleModalOpen} />
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          size="tiny"
          closeIcon
        >
          <Modal.Header>
            <Icon
              circular
              color="teal"
              name="help"
              size="tiny"
              style={{
                position: 'relative',
                top: '-3px',
                marginRight: '1em'
              }}
            />
            {label}
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {description || (
                <p>No information is available for this attribute.</p>
              )}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={handleCloseModal}>
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    </div>
  )
}

/**
 * Is the input invalid?
 * Returns true if NaN (cannot be parsed by parseFloat) or negative value
 * Do not return false if the value hasn't been defined yet (or is null or empty string)
 *
 * @param {Any} value
 */
function isInvalidInput (value) {
  if (
    typeof value === 'undefined' ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return false
  }
  const val = Number.parseFloat(value)
  return Number.isNaN(val) || val < 0
}

export default DataInput
