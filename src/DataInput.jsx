import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input, Dropdown, Icon, Modal, Button, Table } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import UNITS from './data/units.json'
import './DataInput.css'

DataInput.propTypes = {
  attribute: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    definedUnits: PropTypes.string,
    defaultUnit: PropTypes.string.isRequired,
    exampleValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    thresholds: PropTypes.arrayOf(PropTypes.array).isRequired
  }),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      units: PropTypes.string
    })
  ]),
  onChange: PropTypes.func
}

function DataInput (props) {
  const { attribute, value, onChange = () => {} } = props
  const {
    name,
    description,
    definedUnits,
    defaultUnit,
    exampleValue,
    thresholds
  } = attribute
  const units =
    typeof definedUnits !== 'undefined' ? UNITS[definedUnits] : defaultUnit

  const [isModalOpen, setModalOpen] = useState(false)
  const inputValue = typeof value === 'object' ? value.value : value
  const unitsValue =
    (typeof value === 'object' && value.units) || units[0].value
  const htmlId = uniqueId('data-input_')

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
      <label htmlFor={htmlId}>{name}</label>
      <Input
        id={htmlId}
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
        placeholder={`example: ${exampleValue}`}
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
            {name}
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {description || (
                <p>No information is available for this attribute.</p>
              )}
            </Modal.Description>
            <h4>Thresholds</h4>
            <Table basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Level</Table.HeaderCell>
                  <Table.HeaderCell>Minimum</Table.HeaderCell>
                  <Table.HeaderCell>Maximum</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {thresholds.map((row, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>
                      {row[0]} {defaultUnit}
                    </Table.Cell>
                    <Table.Cell>
                      {(index !== 3 && `${row[1]} ${defaultUnit}`) || '∞'}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
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
