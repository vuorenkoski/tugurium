import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import Timeseries from './components/Timeseries'
import Settings from './components/Settings'
import Home from './components/Home'
import Login from './components/Login'
import Years from './components/Years'
import Statistics from './components/Statistics'
import SwitchesView from './components/SwitchesView'
import NewMeasurement from './components/NewMeasurement'
import ImagesView from './components/ImagesView'
import MessagesView from './components/MessagesView'
import { Navbar, Nav, NavbarBrand } from 'react-bootstrap'
import { VERSION } from './util/config'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom'

const App = () => {
  const [logged, setLogged] = useState(false)
  const client = useApolloClient()
  const user = JSON.parse(localStorage.getItem('tugurium-user'))
  if (!logged) {
    if (!user) {
      return (
        <div className="container">
          <Navbar collapseOnSelect expand="lg" bg="dark" className="p-3">
            <NavbarBrand className="text-white">TUGURIUM</NavbarBrand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto"></Nav>
            </Navbar.Collapse>
          </Navbar>
          version: {VERSION}
          <Login setLogged={setLogged} />
        </div>
      )
    }
    setLogged(true)
  }

  const logout = () => {
    localStorage.clear()
    setLogged(false)
    client.clearStore()
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
          <NavbarBrand className="text-white">TUGURIUM</NavbarBrand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? 'activeMenuitem' : 'menuitem'
                  }
                >
                  Sensorit
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <NavLink
                  to="/timeseries"
                  className={({ isActive }) =>
                    isActive ? 'activeMenuitem' : 'menuitem'
                  }
                >
                  Aikasarjat
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <NavLink
                  to="/annual"
                  className={({ isActive }) =>
                    isActive ? 'activeMenuitem' : 'menuitem'
                  }
                >
                  Vuosivertailu
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <NavLink
                  to="/images"
                  className={({ isActive }) =>
                    isActive ? 'activeMenuitem' : 'menuitem'
                  }
                >
                  Kamerat
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <NavLink
                  to="/switches"
                  className={({ isActive }) =>
                    isActive ? 'activeMenuitem' : 'menuitem'
                  }
                >
                  Kytkimet
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <NavLink
                  to="/statistics"
                  className={({ isActive }) =>
                    isActive ? 'activeMenuitem' : 'menuitem'
                  }
                >
                  Tilastoja
                </NavLink>
              </Nav.Link>
              {user.admin && (
                <Nav.Link href="#" as="span">
                  <NavLink
                    to="/newMeasurement"
                    className={({ isActive }) =>
                      isActive ? 'activeMenuitem' : 'menuitem'
                    }
                  >
                    Uusi mittaus
                  </NavLink>
                </Nav.Link>
              )}
              {user.admin && (
                <Nav.Link href="#" as="span">
                  <NavLink
                    to="/messages"
                    className={({ isActive }) =>
                      isActive ? 'activeMenuitem' : 'menuitem'
                    }
                  >
                    Viestit
                  </NavLink>
                </Nav.Link>
              )}
              <Nav.Link href="#" as="span">
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive ? 'activeMenuitem' : 'menuitem'
                  }
                >
                  Asetukset
                </NavLink>
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
          <Route path="/newMeasurement" element={<NewMeasurement />} />
          <Route path="/switches" element={<SwitchesView />} />
          <Route path="/images" element={<ImagesView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/annual" element={<Years />} />
          <Route path="/" element={<Home />} />
          <Route path="/timeseries" element={<Timeseries />} />
          <Route path="/messages" element={<MessagesView />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
