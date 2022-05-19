import { Row } from 'react-bootstrap'
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
      <Row className="p-4 pb-0">
        <h2>Sensorien/kameroiden/kytkimien token</h2>
        {sensorToken.data && (
          <p style={{ fontFamily: 'monospace' }}>
            {sensorToken.data.sensorToken.value}
          </p>
        )}
      </Row>
    </div>
  )
}

export default Settings
