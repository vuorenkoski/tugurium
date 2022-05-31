import { Table, Row, Col } from 'react-bootstrap'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_SENSORS, NEW_MEASUREMENT } from '../queries'
import { convertDate, convertTemp } from '../util/conversions'

const Home = () => {
  const sensors = useQuery(ALL_SENSORS, {
    fetchPolicy: 'network-only',
  })

  useSubscription(NEW_MEASUREMENT)

  return (
    <div>
      <Row className="p-4">
        <Col>
          <h2>Viimeisimmät lämpötilat</h2>
        </Col>
      </Row>

      <Row className="p-4">
        {!sensors.data && sensors.loading && <p>Lataa tietoja...</p>}
        {!sensors.data && sensors.error && (
          <p className="errorMessage">Virhe: {sensors.error.message}</p>
        )}

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
                    <td>{s.sensorFullname}</td>
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
