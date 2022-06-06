import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import Sensors from './Sensors'
import Users from './Users'
import Images from './Images'
import Switches from './Switches'
import PasswordChange from './PasswordChange'

import { SENSOR_TOKEN } from '../graphql/sensor'
import { VERSION } from '../util/config'

const Settings = () => {
  const sToken = useQuery(SENSOR_TOKEN)
  const [backendVersion, setBackendVersion] = useState('')
  const user = JSON.parse(localStorage.getItem('tugurium-user'))

  useEffect(() => {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        setBackendVersion(this.responseText)
      }
    }
    xhttp.open('GET', '/api/version', true)
    xhttp.send()
  }, [])

  return (
    <div>
      <Row className="p-4 pb-0">
        <Col>
          <h2>Asetukset</h2>
        </Col>
      </Row>
      {!sToken.data && sToken.loading && (
        <Row className="p-4 pb-0">
          <Col>
            <p>Ladataan dataa palvelimelta...</p>
          </Col>
        </Row>
      )}
      {!sToken.data && sToken.error && sToken.error.networkError && (
        <Row className="p-4 pb-0">
          <Col>
            <p className="errorMessage">
              Virhe: Verkkovirhe (backend ei tavoitettavissa?)
            </p>
          </Col>
        </Row>
      )}
      {sToken.data && (
        <div>
          <PasswordChange user={user} />
          <Users admin={user.admin} />
          <Sensors admin={user.admin} />
          <Images admin={user.admin} />
          <Switches admin={user.admin} />
          <Row className="p-4 pb-1">
            <Col>
              <h3>Versiot</h3>
            </Col>
          </Row>
          <Row className="p-4 pt-1 pb-0">
            <Col>
              <p>Frontend: Tugurium {VERSION}</p>
            </Col>
          </Row>
          <Row className="p-4 pt-0">
            <Col>
              <p>Backend: {backendVersion}</p>
            </Col>
          </Row>
          {user.admin && (
            <div>
              <Row className="p-4 pb-1">
                <Col>
                  <h3>Sensorien/kameroiden/kytkimien token</h3>
                </Col>
              </Row>
              <Row className="p-4 pt-1">
                <Col className="col-auto">
                  <div className="tokenText">
                    {sToken.data.sensorToken.token
                      .match(/.{1,40}/g)
                      .map((s) => (
                        <div key={s}>{s}</div>
                      ))}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Settings
