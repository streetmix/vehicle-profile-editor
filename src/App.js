import React, { useState, useEffect } from 'react'
import { Grid, Dropdown } from 'semantic-ui-react'
import Radar from 'react-d3-radar'
import DataInput from './DataInput'
import UNITS from './data/units.json'
import ATTRIBUTES from './data/attributes_numo.json'
import './App.css'

const VEHICLE_PRESETS = [
  {
    key: 'Pedestrian: adult',
    text: 'Pedestrian: adult',
    value: 'Pedestrian: adult',
    weight: 1,
    speed: 1,
    footprint: 1,
    emissions: 1,
    health: 1
  },
  {
    key: 'Pedestrian: children',
    text: 'Pedestrian: children',
    value: 'Pedestrian: children',
    weight: 1,
    speed: 1,
    footprint: 1,
    emissions: 1,
    health: 1
  },
  {
    key: 'Automobile: SUV',
    text: 'Automobile: SUV',
    value: 'Automobile: SUV',
    weight: 3,
    speed: 4,
    footprint: 4,
    emissions: 4,
    health: 4
  },
  {
    key: 'Automobile: compact',
    text: 'Automobile: compact',
    value: 'Automobile: compact',
    weight: 3,
    speed: 4,
    footprint: 4,
    emissions: 4,
    health: 4
  },
  {
    key: 'Automobile: luxury car',
    text: 'Automobile: luxury car',
    value: 'Automobile: luxury car',
    weight: 3,
    speed: 4,
    footprint: 4,
    emissions: 4,
    health: 4
  },
  {
    key: 'Automobile: Electric',
    text: 'Automobile: Electric',
    value: 'Automobile: Electric',
    weight: 3,
    speed: 4,
    footprint: 4,
    emissions: 1,
    health: 4
  },
  {
    key: 'Automobile: Hybrid',
    text: 'Automobile: Hybrid',
    value: 'Automobile: Hybrid',
    weight: 3,
    speed: 4,
    footprint: 4,
    emissions: 4,
    health: 4
  },
  {
    key: 'Ridesharing',
    text: 'Ridesharing',
    value: 'Ridesharing',
    weight: 3,
    speed: 4,
    footprint: 4,
    emissions: 4,
    health: 4
  },
  {
    key: 'Bicycle',
    text: 'Bicycle',
    value: 'Bicycle',
    weight: 1,
    speed: 2,
    footprint: 2,
    emissions: 1,
    health: 1
  },
  {
    key: 'Ebike',
    text: 'Ebike',
    value: 'Ebike',
    weight: 2,
    speed: 3,
    footprint: 2,
    emissions: 1,
    health: 2
  },
  {
    key: 'E-scooter',
    text: 'E-scooter',
    value: 'E-scooter',
    weight: 1,
    speed: 2,
    footprint: 2,
    emissions: 1,
    health: 2
  },
  {
    key: 'Bus: Diesel',
    text: 'Bus: Diesel',
    value: 'Bus: Diesel',
    weight: 4,
    speed: 4,
    footprint: 2,
    emissions: 4,
    health: 2
  },
  {
    key: 'Bus: Electric',
    text: 'Bus: Electric',
    value: 'Bus: Electric',
    weight: 4,
    speed: 4,
    footprint: 2,
    emissions: 1,
    health: 2
  },
  {
    key: 'Pogo stick',
    text: 'Pogo stick',
    value: 'Pogo stick',
    weight: 1,
    speed: 1,
    footprint: 2,
    emissions: 1,
    health: 2
  },
  {
    key: 'Low speed autonomous shuttles (Black Panther)',
    text: 'Low speed autonomous shuttles (Black Panther)',
    value: 'Low speed autonomous shuttles (Black Panther)',
    weight: 3,
    speed: 3,
    footprint: 2,
    emissions: 1,
    health: 2
  },
  {
    key: 'Aladdin’s magic carpet',
    text: 'Aladdin’s magic carpet',
    value: 'Aladdin’s magic carpet',
    weight: 1,
    speed: 4,
    footprint: 3,
    emissions: 1,
    health: 4
  },
  {
    key: 'Mobile lounge at Dulles',
    text: 'Mobile lounge at Dulles',
    value: 'Mobile lounge at Dulles',
    weight: 4,
    speed: 3,
    footprint: 1,
    emissions: 4,
    health: 3
  },
  {
    key: 'Nimbus 2000',
    text: 'Nimbus 2000',
    value: 'Nimbus 2000',
    weight: 1,
    speed: 4,
    footprint: 2,
    emissions: 1,
    health: 4
  },
  {
    key: 'Mars Rover',
    text: 'Mars Rover',
    value: 'Mars Rover',
    weight: 3,
    speed: 1,
    footprint: 4,
    emissions: 1,
    health: 4
  }
]

function handleDropdownChange (event) {
  console.log(event, event.nativeEvent)
}

function Attributes ({ sendValues = () => {} }) {
  const [values, setValues] = useState({})

  useEffect(() => {
    sendValues(values)
  }, [values, sendValues])

  return ATTRIBUTES.map(
    ({ id, name, description, definedUnits, defaultUnit, exampleValue }) => (
      <DataInput
        key={id}
        label={name}
        units={
          typeof definedUnits !== 'undefined'
            ? UNITS[definedUnits]
            : defaultUnit
        }
        example={exampleValue}
        onChange={value =>
          setValues({ ...values, [id]: Number.parseInt(value, 10) })}
      />
    )
  )
}

function App () {
  const [values, setValues] = useState({})

  function sendValues (values) {
    console.log(values)
    setValues(values)
  }

  return (
    <div className="App">
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column>
            <h1>Vehicle profile editor</h1>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={9}>
            <div className="box">
              <div className="input-row" style={{ marginBottom: '1.5em' }}>
                <Dropdown
                  button
                  className="icon"
                  id="presets"
                  text="Load vehicle preset (optional)"
                  icon="bookmark outline"
                  fluid
                  search
                  labeled
                  floating
                  options={VEHICLE_PRESETS}
                  onChange={handleDropdownChange}
                />
              </div>
              <Attributes sendValues={sendValues} />
            </div>
          </Grid.Column>
          <Grid.Column width={7}>
            <div className="box">
              <Radar
                width={500}
                height={500}
                padding={70}
                domainMax={5}
                highlighted={null}
                onHover={point => {
                  if (point) {
                    console.log('hovered over a data point')
                  } else {
                    console.log('not over anything')
                  }
                }}
                data={{
                  variables: [
                    { key: 'weight', label: 'Weight' },
                    { key: 'speed', label: 'Top speed' },
                    { key: 'footprint', label: 'Footprint' },
                    { key: 'emissions', label: 'Emissions' },
                    { key: 'health', label: 'Health' }
                  ],
                  sets: [
                    {
                      key: 'me',
                      label: 'My Scores',
                      values
                    }
                  ]
                }}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default App
