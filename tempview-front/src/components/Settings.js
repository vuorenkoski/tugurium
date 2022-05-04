import { Table, Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import { ALL_USERS, ALL_SENSORS, SENSOR_TOKEN } from '../queries'

const Settings = () => {
  const users = useQuery(ALL_USERS)
  const sensors = useQuery(ALL_SENSORS)
  const sensorToken = useQuery(SENSOR_TOKEN)

  let sensorList = null
  if (sensors.data) {
    sensorList = sensors.data.allSensors
  }

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
        {token}
      </Row>

      <Row className="p-4">
        <h2>Sensorit</h2>
        <Col className="col-8">
          <Table striped>
            <tbody>
              <tr>
                <th>Nimi</th>
                <th>Kuvaus</th>
                <th>Mittayksikkö</th>
                <th>Id</th>
              </tr>
              {sensorList.map((a) => (
                <tr key={a.id}>
                  <td>{a.sensorName}</td>
                  <td>{a.sensorFullname}</td>
                  <td>{a.sensorUnit}</td>
                  <td>{a.id}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  )
}

export default Settings
