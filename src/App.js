import React, { useState } from 'react'
import { Grid, Divider } from 'semantic-ui-react'
import Header from './components/Header'
import Footer from './components/Footer'
import InputPanel from './components/InputPanel/InputPanel'
import ResultPanel from './components/ResultPanel/ResultPanel'
import './App.css'

function App () {
  const [values, setValues] = useState({})
  const [selectedVehicle, setSelectedVehicle] = useState({})

  return (
    <div className="App">
      <Grid stackable>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column width={9}>
            <InputPanel
              values={values}
              selectedVehicle={selectedVehicle}
              setValues={setValues}
              setSelectedVehicle={setSelectedVehicle}
            />
          </Grid.Column>
          <Grid.Column width={7}>
            <ResultPanel vehicle={selectedVehicle} values={values} />
          </Grid.Column>
        </Grid.Row>

        {/* Branding / credits. Leave this at the bottom! */}
        <Grid.Row columns={1}>
          <Grid.Column>
            <Divider />
            <Footer />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default App
