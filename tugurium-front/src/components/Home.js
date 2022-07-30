import { Table, Row, Col } from 'react-bootstrap'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_SENSORS, NEW_MEASUREMENT } from '../graphql/sensor'
import { convertDate, convertTemp } from '../util/conversions'
import { NETWORK_ERROR, LOADING } from '../util/config'

const Home = () => {
  const sensors = useQuery(ALL_SENSORS, {
    fetchPolicy: 'network-only',
  })

  useSubscription(NEW_MEASUREMENT)

  return (
    <div>
      <Row className="p-4 pb-0">
        <Col>
          <h2>Viimeisimmät mittaukset</h2>
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
      <Row className="p-4">
        <Col className="col-auto">
          {sensors.data && (
            <Table striped>
              <tbody>
                <tr>
                  <th>Sensori</th>
                  <th>Lämpötila</th>
                  <th>Aikaleima</th>
                </tr>
                {sensors.data.allSensors.map((s) => (
                  <tr key={s.sensorName}>
                    <td>
                      {
                        <>
                          <a
                            href={'/timeseries?sensor=' + s.sensorName}
                            className="sensorLink"
                          >
                            {s.sensorFullname}
                          </a>
                        </>
                      }
                    </td>
                    <td>{convertTemp(s.lastValue, s.sensorUnit)}</td>
                    <td>{convertDate(s.lastTimestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default Home
