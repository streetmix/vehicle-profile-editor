import React, { Suspense, useState } from 'react'
import { Grid, Divider } from 'semantic-ui-react'
import Header from './components/Header'
import Footer from './components/Footer'
import InputPanel from './components/InputPanel/InputPanel'
import ResultPanel from './components/ResultPanel/ResultPanel'
import ResultPage from './components/ResultPanel/ResultPage'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import i18n from './i18n'

// page uses the hook
function Page () {
  const [vehicle, setVehicle] = useState({})
  i18n.changeLanguage('eng')
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
function AppRouter () {
  const [vehicle, setVehicle] = useState({})
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <Grid stackable>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <ResultPage vehicle={vehicle} setVehicle={setVehicle} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Route>
          <Route path="/users" />
          <Route path="/">
            <Page />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
)

// here app catches the suspense from page in case translations are not yet loaded
export default function App () {
  return (
    <Suspense fallback={<Loader />}>
      <AppRouter />
    </Suspense>
  )
}
