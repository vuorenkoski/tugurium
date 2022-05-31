import { Table, Row, Col, Form, Button } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  ALL_SENSORS,
  DELETE_SENSOR,
  UPDATE_SENSOR,
  NEW_SENSOR,
} from '../queries'
const { AGGREGATE_METHODS } = require('../util/config')

const Sensors = () => {
  const [displaySensorForm, setDisplaySensorForm] = useState(false)
  const [sensorName, setSensorName] = useState('')
  const [sensorUnit, setSensorUnit] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [sensorFullname, setSensorFullname] = useState('')
  const [agrmethod, setAgrmethod] = useState('')
  const [sensorId, setSensorId] = useState(-1)
  const [sensors, setSensors] = useState([])

  useQuery(ALL_SENSORS, {
    onCompleted: (data) => setSensors(data.allSensors),
  })

  const [deleteSensor] = useMutation(DELETE_SENSOR, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    },
    refetchQueries: [{ query: ALL_SENSORS }],
  })

  const [updateSensor] = useMutation(UPDATE_SENSOR, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
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

  const handeDeleteSensor = (id) => {
    setSensors(sensors.filter((s) => s.id !== id))
    const variables = { deleteSensorId: Number(id) }
    deleteSensor({ variables })
  }

  const handleUpdateSensor = (id) => {
    setDisplaySensorForm(true)
    const sensor = sensors.filter((s) => s.id === id)[0]
    setSensorName(sensor.sensorName)
    setSensorFullname(sensor.sensorFullname)
    setSensorUnit(sensor.sensorUnit)
    setAgrmethod(sensor.agrmethod)
    setSensorId(Number(sensor.id))
  }

  const handleNewSensor = (id) => {
    setDisplaySensorForm(true)
    setSensorName('')
    setSensorFullname('')
    setSensorUnit('')
    setAgrmethod('AVG')
    setSensorId(-1)
  }

  const handleSubmitSensor = async (event) => {
    event.preventDefault()
    if (sensorId === -1) {
      const variables = { sensorName, sensorFullname, sensorUnit, agrmethod }
      await newSensor({ variables })
    } else {
      const variables = {
        sensorName,
        sensorFullname,
        sensorUnit,
        agrmethod,
        updateSensorId: sensorId,
      }
      await updateSensor({ variables })
    }
  }

  const handleAgrChange = (e) => {
    setAgrmethod(e.target.value)
  }

  const closeSensorForm = () => {
    setErrorMessage(null)
    setDisplaySensorForm(false)
  }

  return (
    <div>
      <Row className="p-4 pb-1">
        <Col>
          <h2>Sensorit</h2>
        </Col>
      </Row>
      <Row className="p-4 pt-1 pb-1">
        <Col className="col-auto">
          <Table striped>
            <tbody>
              <tr>
                <th>Nimi</th>
                <th>Kuvaus</th>
                <th>Mittayksikkö</th>
                <th>Koonti metodi</th>
                <th>Id</th>
                <th></th>
                <th></th>
              </tr>
              {sensors.map((a) => (
                <tr key={a.id}>
                  <td>{a.sensorName}</td>
                  <td>{a.sensorFullname}</td>
                  <td>{a.sensorUnit}</td>
                  <td>{a.agrmethod}</td>
                  <td>{a.id}</td>
                  <td>
                    <button
                      className="removeButton"
                      onClick={() => handeDeleteSensor(a.id)}
                    >
                      poista
                    </button>
                  </td>
                  <td>
                    <button
                      className="updateButton"
                      onClick={() => handleUpdateSensor(a.id)}
                    >
                      päivitä
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {!displaySensorForm && (
        <Row className="p-4 pt-1 pb-1">
          <Col>
            <Button onClick={() => handleNewSensor()}>Lisää uusi</Button>
          </Col>
        </Row>
      )}

      {displaySensorForm && (
        <div>
          <Row className="p-4 pt-1 pb-1 align-item-bottom">
            <Col className="col-auto p-2">
              <Form>
                <Form.Group>
                  <Form.Label>Nimi</Form.Label>
                  <Form.Control
                    type="text"
                    value={sensorName}
                    onChange={({ target }) => setSensorName(target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col className="col-auto p-2">
              <Form>
                <Form.Group>
                  <Form.Label>Kuvaus</Form.Label>
                  <Form.Control
                    type="text"
                    value={sensorFullname}
                    onChange={({ target }) => setSensorFullname(target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col className="col-auto p-2">
              <Form>
                <Form.Group>
                  <Form.Label>Mittayksikkö</Form.Label>
                  <Form.Control
                    type="text"
                    value={sensorUnit}
                    onChange={({ target }) => setSensorUnit(target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col className="col-auto p-2">
              <Form>
                <Form.Group>
                  <Form.Label>Yhdistämismetodi</Form.Label>
                  <Form.Select
                    onChange={handleAgrChange.bind(this)}
                    defaultValue={agrmethod}
                  >
                    {AGGREGATE_METHODS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row className="p-4 pt-1 pb-1">
            <Col className="col-auto">
              <Button onClick={handleSubmitSensor}>päivitä/lisää</Button>
            </Col>
            <Col className="col-auto">
              <Button onClick={closeSensorForm}>peruuta</Button>
            </Col>
          </Row>
        </div>
      )}
      <Row className="p-4">
        <Col className="errorMessage">{errorMessage}</Col>
      </Row>
    </div>
  )
}

export default Sensors
