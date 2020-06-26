import React, { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Divider } from 'semantic-ui-react'
import { ReactComponent as NUMOLogo } from './images/logo_numo.svg'
import Header from './components/Header'
import Footer from './components/Footer'
import InputPanel from './components/InputPanel/InputPanel'
import ResultPanel from './components/ResultPanel/ResultPanel'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button
} from 'react-bootstrap'

// page uses the hook
function Page () {
  const [vehicle, setVehicle] = useState({})

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
  const { t, i18n } = useTranslation()
  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
  }
  return (
    <Router>
      <div>
        <Navbar bg="ligt" expand="lg">
          <Navbar.Brand href="/">
            <NUMOLogo
              style={{
                height: '2.5em'
              }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>
                <Link to="/">{t('routing.profiles')}</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/about">{t('routing.results')}</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/users">Users</Link>
              </Nav.Link>
              <NavDropdown title="Locale" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => changeLanguage('en')}>
                  en
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage('es')}>
                  es
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about" />
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
