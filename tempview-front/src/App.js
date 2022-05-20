import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import { ALL_SENSORS } from './queries'
import Timeseries from './components/Timeseries'
import Settings from './components/Settings'
import Home from './components/Home'
import Login from './components/Login'
import Years from './components/Years'
import Statistics from './components/Statistics'
import SwitchesView from './components/SwitchesView'
import ImagesView from './components/ImagesView'
import { Navbar, Nav, NavbarBrand } from 'react-bootstrap'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  const sensors = useQuery(ALL_SENSORS)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  if (!token && !localStorage.getItem('tempview-user-token')) {
    return (
      <div className="container">
        <Navbar collapseOnSelect expand="lg" bg="dark" className="p-3">
          <NavbarBrand className="text-white">TEMPVIEW</NavbarBrand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
          </Navbar.Collapse>
        </Navbar>
        <Login setToken={setToken} />
      </div>
    )
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  let sensorList = []
  if (sensors.data) {
    sensorList = sensors.data.allSensors
  }

  return (
    <div className="container">
      <Router>
        <Navbar
          collapseOnSelect
          expand="lg"
          variant="dark"
          bg="dark"
          className="p-3"
        >
          <NavbarBrand className="text-white">TEMPVIEW</NavbarBrand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link to="/" className="menuitem">
                  Lämpötilat nyt
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/timeseries" className="menuitem">
                  Aikasarjat
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/annual" className="menuitem">
                  Vuosivertailu
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/images" className="menuitem">
                  Kamerat
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/switches" className="menuitem">
                  Kytkimet
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/statistics" className="menuitem">
                  Tilastoja
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/settings" className="menuitem">
                  Asetukset
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <button className="menuitem" onClick={logout}>
                  logout
                </button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes>
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/switches" element={<SwitchesView />} />
          <Route path="/images" element={<ImagesView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/annual" element={<Years />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/timeseries"
            element={<Timeseries sensors={sensorList} />}
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
