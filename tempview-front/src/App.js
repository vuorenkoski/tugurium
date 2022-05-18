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

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
  }

  return (
    <div className="container">
      <Router>
        <Navbar collapseOnSelect expand="lg" bg="dark" className="p-3">
          <NavbarBrand className="text-white">TEMPVIEW</NavbarBrand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link to="/" style={linkStyle}>
                  Lämpötilat nyt
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/timeseries" style={linkStyle}>
                  Aikasarjat
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/annual" style={linkStyle}>
                  Vuosivertailu
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/images" style={linkStyle}>
                  Kuvat
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/switches" style={linkStyle}>
                  Kytkimet
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/statistics" style={linkStyle}>
                  Tilastoja
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/settings" style={linkStyle}>
                  Asetukset
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <button
                  style={{
                    color: 'white',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                  }}
                  onClick={logout}
                >
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
