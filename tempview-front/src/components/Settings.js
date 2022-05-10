import { Table, Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import Sensors from './Sensors'

import { ALL_USERS, SENSOR_TOKEN } from '../queries'

const Settings = () => {
  const users = useQuery(ALL_USERS)
  const sensorToken = useQuery(SENSOR_TOKEN)

  let userList = null
  if (users.data) {
    userList = users.data.allUsers
  }

  let token = ''
  if (sensorToken.data) {
    token = sensorToken.data.sensorToken.value
  }

  return (
    <div>
      <Row className="p-4">
        <h2>Käyttäjät</h2>
        <Col className="col-8">
          <Table striped>
            <tbody>
              <tr>
                <th>Nimi</th>
                <th>Admin</th>
              </tr>
              {userList &&
                userList.map((a) => (
                  <tr key={a.username}>
                    <td>{a.username}</td>
                    <td>{a.admin && <div>kyllä</div>}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="p-4">
        <h2>Sensorien token</h2>
        <p style={{ fontFamily: 'monospace' }}>{token}</p>
      </Row>

      <Sensors />
    </div>
  )
}

export default Settings
