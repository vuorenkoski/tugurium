import { Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import Sensors from './Sensors'
import Users from './Users'
import Images from './Images'
import Switches from './Switches'
import PasswordChange from './PasswordChange'

import { SENSOR_TOKEN } from '../graphql/sensor'

const Settings = () => {
  const sToken = useQuery(SENSOR_TOKEN)
  const user = JSON.parse(localStorage.getItem('tugurium-user'))
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
