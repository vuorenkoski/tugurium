import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import { ALL_SENSORS } from './queries'
import Timeseries from './components/Timeseries'
import Sensors from './components/Sensors'
import Home from './components/Home'
import Login from './components/Login'
import { Navbar, Nav, NavbarBrand } from 'react-bootstrap'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  const sensors = useQuery(ALL_SENSORS)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  if (!token) {
    return (
      <div>
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
                <Link to="/sensors" style={linkStyle}>
                  Sensorit
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
                <Link to="/commands" style={linkStyle}>
                  Komennot
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <a href="#" onClick={logout} style={linkStyle}>
                  logout
                </a>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes>
          <Route path="/sensors" element={<Sensors sensors={sensorList} />} />
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
