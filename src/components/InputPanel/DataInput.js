import React from 'react'
import PropTypes from 'prop-types'
import { Input, Dropdown } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import InputHelp from './InputHelp'
import UNITS from '../../data/units.json'
import './DataInput.css'
import { useTranslation } from 'react-i18next'

DataInput.propTypes = {
  attribute: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    definedUnits: PropTypes.string,
    defaultUnit: PropTypes.string,
    exampleValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    thresholds: PropTypes.arrayOf(PropTypes.array)
  }),
  value: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    units: PropTypes.string
  }),
  onChange: PropTypes.func
}

function DataInput (props) {
  const { attribute, value, onChange = () => {} } = props
  const { name, definedUnits, defaultUnit, exampleValue } = attribute
  const { t } = useTranslation(['translation', 'attributes'])
  const units =
    typeof definedUnits !== 'undefined' ? UNITS[definedUnits] : defaultUnit

  const inputValue = typeof value === 'object' ? value.value : value
  const unitsValue =
    (typeof value === 'object' && value.units) ||
    (Array.isArray(units) && units[0].value) ||
    null
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

  const unitLabel =
    (typeof units === 'string' && { basic: true, content: units }) ||
    (Array.isArray(units) && (
      <Dropdown
        value={unitsValue}
        options={units}
        selection
        onChange={handleUnitChange}
      />
      // There is a conflicting rule below here
      // eslint-disable-next-line
    )) ||
    null

  return (
    <div className="input-row">
      <label htmlFor={htmlId}>{t('attributes:' + name + '.name')}</label>
      <Input
        id={htmlId}
        value={inputValue}
        error={isInvalidInput(inputValue)}
        label={unitLabel}
        labelPosition={unitLabel ? 'right' : undefined}
        placeholder={`${t('inputPanel.example')}: ${exampleValue}`}
        onChange={handleInputChange}
      />
      <InputHelp attribute={attribute} />
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
