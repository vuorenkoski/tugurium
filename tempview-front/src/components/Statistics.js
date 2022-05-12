import { Table, Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import { SENSOR_STATS } from '../queries'
import { convertDateToDate, convertNumber } from '../util/conversions'

const Statistics = () => {
  const sensors = useQuery(SENSOR_STATS)

  let sensorList = null
  if (sensors.data) {
    sensorList = sensors.data.sensorStats
  }

  return (
    <div>
      <Row className="p-4">
        <h2>Tilastoja</h2>
      </Row>

      <Row className="p-4">
        {!sensorList && <h3>Loading...</h3>}

        <Col className="col-6">
          {sensorList && (
            <Table striped>
              <tbody>
                <tr>
                  <th>Sensori</th>
                  <th>lukumäärä</th>
                  <th>Ensimmäinen Aikaleima</th>
                </tr>
                {sensorList.map((a, i) => (
                  <tr key={i}>
                    <td>{a.sensor.sensorFullname}</td>
                    <td>{convertNumber(a.count)}</td>
                    <td>{convertDateToDate(a.firstTimestamp)}</td>
                  </tr>
                ))}
                <tr>
                  <td>YHTEENSÄ</td>
                  <td>
                    {convertNumber(sensorList.reduce((p, c) => p + c.count, 0))}
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default Statistics
