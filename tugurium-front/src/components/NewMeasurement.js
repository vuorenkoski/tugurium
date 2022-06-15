import { Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_SENSORS } from '../graphql/sensor'
import { ADD_MEASUREMENT } from '../graphql/measurement'
import { NETWORK_ERROR, LOADING } from '../util/config'
import { useState } from 'react'
import { convertDate } from '../util/conversions'

const NewMeasurement = () => {
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [measurement, setMeasurement] = useState('')
  const [message, setMessage] = useState('')

  const displayMessage = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 4000)
  }

  const [addMeasurement] = useMutation(ADD_MEASUREMENT, {
    onError: (error) => displayMessage(error.message),
    onCompleted: (data) => {
      console.log(data.addMeasurement)
      setMeasurement('')
      displayMessage(
        `Mitaus lisätty (${convertDate(data.addMeasurement.timestamp)}): ${
          data.addMeasurement.value
        }`
      )
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    },
  })

  const sensors = useQuery(ALL_SENSORS, {
    fetchPolicy: 'network-only',
  })

  const add = () => {
    if (!selectedSensor) {
      displayMessage('Valitse sensori!')
      return
    }
    if (!measurement) {
      displayMessage('Syötä lukema!')
      return
    }
    if (isNaN(Number(measurement))) {
      displayMessage('Lukeman tulee olla numero')
      return
    }
    const variables = { sensorName: selectedSensor, value: measurement }
    addMeasurement({ variables })
  }

  return (
    <div>
      <Row className="p-4 pb-0">
        <Col>
          <h2>Lisää uusi mittauspiste</h2>
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
          <Row className="p-4 pb-2">
            <Col className="col-auto">
              <Form>
                <Form.Select
                  onChange={({ target }) => setSelectedSensor(target.value)}
                  defaultValue="empty"
                >
                  <option disabled value="empty">
                    -- valitse sensori --
                  </option>
                  {sensors.data.allSensors.map((s) => (
                    <option key={s.sensorName} value={s.sensorName}>
                      {s.sensorFullname}
                    </option>
                  ))}
                </Form.Select>
              </Form>
            </Col>
          </Row>
          <Row className="p-4 pb-2">
            <Col className="col-auto">
              <InputGroup>
                <FormControl
                  type="text"
                  value={measurement}
                  placeholder="arvo"
                  onChange={({ target }) => setMeasurement(target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="p-4">
            <Col>
              <button type="button" className="addButton" onClick={() => add()}>
                Lisää
              </button>
            </Col>
          </Row>
          <Row className="p-4 pt-0">
            <Col className="errorMessage">
              <p>{message}</p>
            </Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default NewMeasurement
