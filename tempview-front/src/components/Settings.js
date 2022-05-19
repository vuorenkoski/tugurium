import { Row } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import Sensors from './Sensors'
import Users from './Users'
import Images from './Images'
import Switches from './Switches'

import { SENSOR_TOKEN } from '../queries'

const Settings = () => {
  const sensorToken = useQuery(SENSOR_TOKEN)

  let token = ''
  if (sensorToken.data) {
    token = sensorToken.data.sensorToken.value
  }

  return (
    <div>
      <Users />
      <Sensors />
      <Images />
      <Switches />
      <Row className="p-4 pb-0">
        <h2>Sensorien/kameroiden/kytkimien token</h2>
        <p style={{ fontFamily: 'monospace' }}>{token}</p>
      </Row>
    </div>
  )
}

export default Settings
