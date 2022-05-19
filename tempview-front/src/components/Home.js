import { Table, Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import { CURRENT_SENSOR_DATA } from '../queries'
import { convertDate, convertTemp } from '../util/conversions'

const Home = () => {
  const sensors = useQuery(CURRENT_SENSOR_DATA, {
    fetchPolicy: 'network-only',
  })

  return (
    <div>
      <Row className="p-4">
        <h2>Viimeisimmät lämpötilat</h2>
      </Row>

      <Row className="p-4">
        {!sensors.data && <p>Lataa tietoja...</p>}

        <Col className="col-6">
          {sensors.data && (
            <Table striped>
              <tbody>
                <tr>
                  <th>Sensori</th>
                  <th>Lämpötila</th>
                  <th>Aikaleima</th>
                </tr>
                {sensors.data.currentSensorData.map((a, i) => (
                  <tr key={i}>
                    <td>{a.sensor.sensorFullname}</td>
                    <td>
                      {convertTemp(a.value)} {a.sensor.sensorUnit}
                    </td>
                    <td>{convertDate(a.timestamp)}</td>
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
