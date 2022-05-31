import { Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import Sensors from './Sensors'
import Users from './Users'
import Images from './Images'
import Switches from './Switches'

import { SENSOR_TOKEN, ALL_USERS } from '../queries'

const Settings = () => {
  const sensorToken = useQuery(SENSOR_TOKEN)
  const users = useQuery(ALL_USERS)

  return (
    <div>
      <Row className="p-4 pb-0">
        <Col>
          <h2>Asetukset</h2>
        </Col>
      </Row>
      {!users.data && users.loading && (
        <Row className="p-4 pb-0">
          <Col>
            <p>Ladataan dataa palvelimelta...</p>
          </Col>
        </Row>
      )}
      {!users.data && users.error && users.error.networkError && (
        <Row className="p-4 pb-0">
          <Col>
            <p className="errorMessage">
              Virhe: Verkkovirhe (backend ei tavoitettavissa?)
            </p>
          </Col>
        </Row>
      )}
      {users.data && (
        <div>
          <Users users={users} />
          <Sensors />
          <Images />
          <Switches />
          {sensorToken.data && (
            <div>
              <Row className="p-4 pb-1">
                <Col>
                  <h2>Sensorien/kameroiden/kytkimien token</h2>
                </Col>
              </Row>
              <Row className="p-4 pt-1">
                <Col className="col-auto">
                  <div className="tokenText">
                    {sensorToken.data.sensorToken.value
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
