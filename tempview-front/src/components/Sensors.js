import { Table, Row, Col, Form, Button } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  ALL_SENSORS,
  DELETE_SENSOR,
  UPDATE_SENSOR,
  NEW_SENSOR,
} from '../queries'

const Sensors = () => {
  const [displaySensorForm, setDisplaySensorForm] = useState(false)
  const [sensorName, setSensorName] = useState('')
  const [sensorUnit, setSensorUnit] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [sensorFullname, setSensorFullname] = useState('')
  const [sensorId, setSensorId] = useState(-1)
  const sensors = useQuery(ALL_SENSORS)

  const [deleteSensor] = useMutation(DELETE_SENSOR, {
    refetchQueries: [{ query: ALL_SENSORS }],
  })

  const [updateSensor] = useMutation(UPDATE_SENSOR, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
    },
    onCompleted: (data) => {
      closeSensorForm()
    },
    refetchQueries: [{ query: ALL_SENSORS }],
  })

  const [newSensor] = useMutation(NEW_SENSOR, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
    },
    onCompleted: (data) => {
      closeSensorForm()
    },
    refetchQueries: [{ query: ALL_SENSORS }],
  })

  let sensorList = null
  if (sensors.data) {
    sensorList = sensors.data.allSensors
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
      const variables = { sensorName, sensorFullname, sensorUnit }
      await newSensor({ variables })
    } else {
      const variables = {
        sensorName,
        sensorFullname,
        sensorUnit,
        updateSensorId: sensorId,
      }
      await updateSensor({ variables })
    }
  }

  const closeSensorForm = () => {
    setErrorMessage(null)
    setDisplaySensorForm(false)
  }

  return (
    <Row className="p-4" style={{ caretColor: 'white' }}>
      <h2>Sensorit</h2>
      <Col className="col-8">
        <Row>
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
                    <button
                      style={{ all: 'unset', color: 'red', cursor: 'hand' }}
                      onClick={() => handeDeleteSensor(a.id)}
                    >
                      poista
                    </button>
                  </td>
                  <td>
                    <button
                      style={{ all: 'unset', color: 'blue', cursor: 'hand' }}
                      onClick={() => handeUpdateSensor(a.id)}
                    >
                      päivitä
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>

        {displaySensorForm && (
          <div>
            <Row className="align-items-end">
              <Col className="col-2">
                <Form>
                  <Form.Group>
                    <Form.Label>Nimi</Form.Label>
                    <Form.Control
                      type="text"
                      value={sensorName}
                      onChange={({ target }) => setSensorName(target.value)}
                      style={{ caretColor: 'black' }}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col className="col-4">
                <Form>
                  <Form.Group>
                    <Form.Label>Kuvaus</Form.Label>
                    <Form.Control
                      type="text"
                      value={sensorFullname}
                      onChange={({ target }) => setSensorFullname(target.value)}
                      style={{ caretColor: 'black' }}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col className="col-2">
                <Form>
                  <Form.Group>
                    <Form.Label>Mittayksikkö</Form.Label>
                    <Form.Control
                      type="text"
                      value={sensorUnit}
                      onChange={({ target }) => setSensorUnit(target.value)}
                      style={{ caretColor: 'black' }}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col className="col-2">
                <Button onClick={handleSubmitSensor}>päivitä/lisää</Button>
              </Col>
              <Col className="col-2">
                <Button onClick={closeSensorForm}>peruuta</Button>
              </Col>
            </Row>
            <Row style={{ color: 'red' }}>{errorMessage}</Row>
          </div>
        )}
        {!displaySensorForm && (
          <Button onClick={() => handeNewSensor()}>Lisää uusi</Button>
        )}
      </Col>
    </Row>
  )
}

export default Sensors
