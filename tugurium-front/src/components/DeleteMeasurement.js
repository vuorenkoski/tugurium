import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  Row,
  Col,
  Form,
  Table,
  Modal,
  Container,
  Button,
} from 'react-bootstrap'
import { DELETE_MEASUREMENT, SENSOR_DATA } from '../graphql/measurement'
import { ALL_SENSORS } from '../graphql/sensor'
import { NETWORK_ERROR, LOADING } from '../util/config'
import { convertDate, convertTemp } from '../util/conversions'

const DeleteMeasurement = () => {
  const today = new Date()
  const [selectedSensor, setSelectedSensor] = useState('')
  const [selectedDate, setSelectedDate] = useState(
    '' +
      today.getFullYear().toString() +
      '-' +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      today.getDate().toString().padStart(2, '0')
  )
  const [removeMeasurement, setRemoveMeasurement] = useState(null)

  const [deleteMeasurement] = useMutation(DELETE_MEASUREMENT, {
    refetchQueries: [
      {
        query: SENSOR_DATA,
        variables: {
          sensorName: selectedSensor,
          average: 'NO',
          minDate: Date.parse(selectedDate) / 1000,
          maxDate: Date.parse(selectedDate) / 1000 + 24 * 60 * 60,
        },
      },
    ],
  })

  const sensorData = useQuery(SENSOR_DATA, {
    variables: {
      sensorName: selectedSensor,
      average: 'NO',
      minDate: Date.parse(selectedDate) / 1000,
      maxDate: Date.parse(selectedDate) / 1000 + 24 * 60 * 60,
    },
  })
  const sensors = useQuery(ALL_SENSORS)

  const handleSensorChange = (e) => {
    setSelectedSensor(e.target.value)
  }

  const handleDateChange = (e) => {
    console.log(Date.parse(e.target.value))
    setSelectedDate(e.target.value)
  }

  const handleDelete = () => {
    const id = removeMeasurement.id
    const variables = { deleteMeasurementId: Number(id) }
    deleteMeasurement({ variables })
    setRemoveMeasurement(null)
  }

  return (
    <div>
      <Row className="p-4 pb-0">
        <Col>
          <h2>Mittauksen poistaminen</h2>
        </Col>
      </Row>
      {!sensors.data && sensors.loading && (
        <Row className="p-4 pb-0">
          <Col>
            <p>{LOADING}</p>
          </Col>
        </Row>
      )}
      {!sensors.data && sensors.error && sensors.error.networkError && (
        <Row className="p-4 pb-0">
          <Col>
            <p className="errorMessage">{NETWORK_ERROR}</p>
          </Col>
        </Row>
      )}
      {sensors.data && (
        <div>
          <Row className="p-4 pt-0 pb-0">
            <Form>
              <Col>
                <Row>
                  <Col className="col-auto border rounded m-3 p-3">
                    <Row className="align-items-center">
                      <Col className="col-auto">
                        <h4>Sensori</h4>
                      </Col>
                      <Col className="col-auto">
                        <Form.Select
                          onChange={handleSensorChange.bind(this)}
                          defaultValue="empty"
                        >
                          <option disabled value="empty">
                            -- valitse --
                          </option>
                          {sensors.data &&
                            sensors.data.allSensors.map((s) => (
                              <option key={s.sensorName} value={s.sensorName}>
                                {s.sensorFullname}
                              </option>
                            ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="col-auto border rounded m-3 p-3">
                    <Row>
                      <h4>Päivämäärä</h4>
                    </Row>
                    <Row>
                      <Form.Control
                        type="date"
                        name="date"
                        placeholder="Päivämäärä"
                        value={selectedDate}
                        onChange={handleDateChange.bind(this)}
                      />
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Form>
          </Row>
          {sensorData.data && (
            <Row className="p-4">
              <Col className="col-auto">
                <Table striped>
                  <tbody>
                    <tr>
                      <th>Lämpötila</th>
                      <th>Aikaleima</th>
                      <th></th>
                    </tr>
                    {sensorData.data.sensorData.measurements.map((s) => (
                      <tr key={s.id}>
                        <td>
                          {convertTemp(
                            s.value,
                            sensorData.data.sensorData.sensorUnit
                          )}
                        </td>
                        <td>{convertDate(s.timestamp)}</td>
                        <td>
                          <button
                            type="button"
                            className="removeButton"
                            onClick={() => setRemoveMeasurement(s)}
                          >
                            poista
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
          {!sensorData.data && selectedSensor && selectedDate && (
            <Row className="p-4">
              <Col className="col-9">
                <p>{LOADING}</p>
              </Col>
            </Row>
          )}
        </div>
      )}

      <Modal
        show={removeMeasurement}
        onHide={() => setRemoveMeasurement(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Mittauksen poistaminen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <h2>{removeMeasurement?.value}</h2>
            </Row>
            <Row>
              <p>Oletko varma että haluat poistaa mittauksen?</p>
            </Row>
            <Row className="p-4">
              <Col className="col-auto">
                <Button onClick={handleDelete}>Poista</Button>
              </Col>
              <Col className="col-auto">
                <Button
                  variant="secondary"
                  onClick={() => setRemoveMeasurement(null)}
                >
                  Peruuta
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DeleteMeasurement
