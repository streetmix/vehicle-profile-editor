import React, { useState, useEffect } from 'react'
import { Grid, Divider } from 'semantic-ui-react'
import Header from './components/Header'
import Footer from './components/Footer'
import InputPanel from './components/InputPanel/InputPanel'
import ResultPanel from './components/ResultPanel/ResultPanel'
import { encodeURLString, decodeURLString } from './utils/url'
import './App.css'

function App () {
  const [vehicle, setVehicle] = useState({})

  useEffect(() => {
    const urlstring = encodeURLString(vehicle)
    console.log(urlstring)
    // window.location.search = '?q=' + urlstring
    console.log(decodeURLString(urlstring))
  }, [vehicle])

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
            <InputPanel vehicle={vehicle} setVehicle={setVehicle} />
          </Grid.Column>
          <Grid.Column width={7}>
            <ResultPanel vehicle={vehicle} />
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
