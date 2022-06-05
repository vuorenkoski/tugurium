import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  Container,
  InputGroup,
  FormControl,
  FormSelect,
} from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  ALL_SENSORS,
  DELETE_SENSOR,
  UPDATE_SENSOR,
  NEW_SENSOR,
} from '../graphql/sensor'
const { AGGREGATE_METHODS } = require('../util/config')

const Sensors = ({ admin }) => {
  const [displaySensorForm, setDisplaySensorForm] = useState(false)
  const [sensorName, setSensorName] = useState('')
  const [sensorUnit, setSensorUnit] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [sensorFullname, setSensorFullname] = useState('')
  const [agrmethod, setAgrmethod] = useState('')
  const [sensorId, setSensorId] = useState(-1)
  const [sensors, setSensors] = useState([])
  const [deleteSensorId, setDeleteSensorId] = useState(null)

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

  const handeDeleteSensor = () => {
    const id = deleteSensorId.id
    setSensors(sensors.filter((s) => s.id !== id))
    const variables = { deleteSensorId: Number(id) }
    deleteSensor({ variables })
    setDeleteSensorId(null)
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

  const handleSubmitSensor = async () => {
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
          <h3>Sensorit</h3>
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
                {admin && (
                  <>
                    <th></th>
                    <th></th>
                  </>
                )}
              </tr>
              {sensors.map((a) => (
                <tr key={a.id}>
                  <td>{a.sensorName}</td>
                  <td>{a.sensorFullname}</td>
                  <td>{a.sensorUnit}</td>
                  <td>{a.agrmethod}</td>
                  {admin && (
                    <>
                      <td>
                        <button
                          type="button"
                          className="removeButton"
                          onClick={() => setDeleteSensorId(a)}
                        >
                          poista
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="updateButton"
                          onClick={() => handleUpdateSensor(a.id)}
                        >
                          päivitä
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {admin && (
        <Row className="p-4 pt-1 pb-1">
          <Col>
            <button
              type="button"
              className="addButton"
              onClick={() => handleNewSensor()}
            >
              Lisää uusi
            </button>
          </Col>
        </Row>
      )}

      <Modal
        show={deleteSensorId}
        onHide={() => setDeleteSensorId(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Sensorin poistaminen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <h2>{deleteSensorId?.sensorFullname}</h2>
            </Row>
            <Row>
              <p>
                Oletko varma että haluat poistaa sensorin? Toimenpide poistaa
                kaikki datapisteet.
              </p>
            </Row>
            <Row className="p-4">
              <Col className="col-auto">
                <Button onClick={handeDeleteSensor}>Poista</Button>
              </Col>
              <Col className="col-auto">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteSensorId(null)}
                >
                  Peruuta
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal show={displaySensorForm} onHide={closeSensorForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sensori</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="nimi"
                  value={sensorName}
                  onChange={({ target }) => setSensorName(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="kuvaus"
                  value={sensorFullname}
                  onChange={({ target }) => setSensorFullname(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  value={sensorUnit}
                  placeholder="Mittayksikkö"
                  onChange={({ target }) => setSensorUnit(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="pt-3 pb-0">
              <p>Koontimetodi:</p>
            </Row>
            <Row className="p-3 pt-0">
              <FormSelect
                onChange={handleAgrChange.bind(this)}
                defaultValue={agrmethod}
              >
                {AGGREGATE_METHODS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </FormSelect>
            </Row>
            <Row className="p-4">
              <Col className="col-auto">
                <Button onClick={handleSubmitSensor}>
                  {sensorId === -1 ? 'Lisää uusi' : 'Päivitä tiedot'}
                </Button>
              </Col>
              <Col className="col-auto">
                <Button variant="secondary" onClick={closeSensorForm}>
                  Peruuta
                </Button>
              </Col>
            </Row>
            <Row className="p-4 pt-0">
              <Col className="errorMessage">{errorMessage}</Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Sensors
