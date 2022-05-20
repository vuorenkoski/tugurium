import { Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import Sensors from './Sensors'
import Users from './Users'
import Images from './Images'
import Switches from './Switches'

import { SENSOR_TOKEN } from '../queries'

const Settings = () => {
  const sensorToken = useQuery(SENSOR_TOKEN)

  return (
    <div>
      <Users />
      <Sensors />
      <Images />
      <Switches />
      <Row className="p-4 pb-1">
        <Col>
          <h2>Sensorien/kameroiden/kytkimien token</h2>
        </Col>
      </Row>
      <Row className="p-4 pt-1">
        {sensorToken.data && (
          <Col className="col-auto">
            <div className="tokenText">
              {sensorToken.data.sensorToken.value.match(/.{1,40}/g).map((s) => (
                <div key={s}>{s}</div>
              ))}
            </div>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Settings
