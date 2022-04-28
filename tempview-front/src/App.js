import { useQuery } from '@apollo/client'
import { ALL_SENSORS } from './queries'
import Timeseries from './components/Timeseries'
import Sensors from './components/Sensors'
import { Navbar, Nav, Row, NavbarBrand } from 'react-bootstrap'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const Home = () => {
  return <div></div>
}

const App = () => {
  const sensors = useQuery(ALL_SENSORS)

  let sensorList = []
  if (sensors.data) {
    sensorList = sensors.data.allSensors
  }

  const user = null

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
                {user ? (
                  <em>{user} logged in</em>
                ) : (
                  <Link to="/login" style={linkStyle}>
                    login
                  </Link>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes>
          <Route path="/sensors" element={<Sensors sensors={sensorList} />} />
          <Route path="/" element={<Home />} />
          <Route path="/timeseries" element={<Timeseries />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
