import { Table, Row, Col, Form, Button } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  ALL_USERS,
  ALL_SENSORS,
  SENSOR_TOKEN,
  DELETE_SENSOR,
  UPDATE_SENSOR,
  NEW_SENSOR,
} from '../queries'

const Settings = () => {
  const [displaySensorForm, setDisplaySensorForm] = useState(false)
  const [sensorName, setSensorName] = useState('')
  const [sensorUnit, setSensorUnit] = useState('')
  const [sensorFullname, setSensorFullname] = useState('')
  const [sensorId, setSensorId] = useState(-1)
  const users = useQuery(ALL_USERS)
  const sensors = useQuery(ALL_SENSORS)
  const sensorToken = useQuery(SENSOR_TOKEN)

  const [deleteSensor] = useMutation(DELETE_SENSOR, {
    refetchQueries: [{ query: ALL_SENSORS }],
  })

  const [updateSensor] = useMutation(UPDATE_SENSOR, {
    refetchQueries: [{ query: ALL_SENSORS }],
  })

  const [newSensor] = useMutation(NEW_SENSOR, {
    refetchQueries: [{ query: ALL_SENSORS }],
  })

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

  const handeDeleteSensor = (id) => {
    const variables = { deleteSensorId: Number(id) }
    deleteSensor({ variables })
  }

  const handeUpdateSensor = (id) => {
    setDisplaySensorForm(true)
    const sensor = sensorList.filter((s) => s.id === id)[0]
    setSensorName(sensor.sensorName)
    setSensorFullname(sensor.sensorFullname)
    setSensorUnit(sensor.sensorUnit)
    setSensorId(Number(sensor.id))
  }

  const handeNewSensor = (id) => {
    setDisplaySensorForm(true)
    setSensorName('')
    setSensorFullname('')
    setSensorUnit('')
    setSensorId(-1)
  }

  const handleSubmitSensor = async (event) => {
    event.preventDefault()
    if (sensorId === -1) {
      console.log('asdasd')
      const variables = { sensorName, sensorFullname, sensorUnit }
      newSensor({ variables })
    } else {
      const variables = {
        sensorName,
        sensorFullname,
        sensorUnit,
        updateSensorId: sensorId,
      }
      updateSensor({ variables })
    }
    setDisplaySensorForm(false)
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
                <th></th>
                <th></th>
              </tr>
              {sensorList.map((a) => (
                <tr key={a.id}>
                  <td>{a.sensorName}</td>
                  <td>{a.sensorFullname}</td>
                  <td>{a.sensorUnit}</td>
                  <td>{a.id}</td>
                  <td>
                    <a href="#" onClick={() => handeDeleteSensor(a.id)}>
                      poista
                    </a>
                  </td>
                  <td>
                    <a href="#" onClick={() => handeUpdateSensor(a.id)}>
                      päivitä
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {displaySensorForm && (
            <Form onSubmit={handleSubmitSensor}>
              <Form.Group className="mb-3">
                <Form.Label>Nimi</Form.Label>
                <Form.Control
                  type="text"
                  value={sensorName}
                  onChange={({ target }) => setSensorName(target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Kuvaus</Form.Label>
                <Form.Control
                  type="text"
                  value={sensorFullname}
                  onChange={({ target }) => setSensorFullname(target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mittayksikkö</Form.Label>
                <Form.Control
                  type="text"
                  value={sensorUnit}
                  onChange={({ target }) => setSensorUnit(target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                päivitä/lisää
              </Button>
              <Button onClick={() => setDisplaySensorForm(false)}>
                peruuta
              </Button>
            </Form>
          )}
          {!displaySensorForm && (
            <Button onClick={() => handeNewSensor()}>Lisää uusi</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default Settings
