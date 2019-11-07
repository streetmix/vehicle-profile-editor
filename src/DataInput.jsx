import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input, Dropdown, Icon } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import './DataInput.css'

DataInput.propTypes = {
  label: PropTypes.string.isRequired,
  example: PropTypes.string.isRequired,
  units: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.arrayOf({
      key: PropTypes.string,
      text: PropTypes.string,
      value: PropTypes.string
    })
  ]).isRequired,
  onChange: PropTypes.func
}

function DataInput (props) {
  const { label, example, units, onChange = () => {} } = props
  const [value, setValue] = useState(null)

  const id = uniqueId('data-input_')

  function handleChange (event) {
    setValue(event.target.value)
    onChange(event.target.value)
  }

  /**
   * Is the input invalid?
   * Returns true if NaN (cannot be parsed by parseFloat) or negative value
   * Do not return false if the value hasn't been defined yet (or is null or empty string)
   *
   * @param {Any} value
   */
  function isInvalidInput (value) {
    if (typeof value === 'undefined' || value === null || value.trim() === '') { return false }
    const val = Number.parseFloat(value)
    return Number.isNaN(val) || val < 0
  }

  return (
    <div className="input-row">
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        value={value}
        error={isInvalidInput(value)}
        label={
          typeof units === 'string' ? (
            { basic: true, content: units }
          ) : (
            <Dropdown defaultValue={units[0].value} options={units} basic />
            // There is a conflicting rule below here
            // eslint-disable-next-line
          )
        }
        labelPosition="right"
        placeholder={`example: ${example}`}
        onChange={handleChange}
      />
      <div className="input-help">
        <Icon circular color="teal" name="help" />
      </div>
    </div>
  )
}

export default DataInput
