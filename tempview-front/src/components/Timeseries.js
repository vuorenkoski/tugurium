import { SENSOR_DATA } from '../queries'
import { convertDate, convertTemp } from '../util/conversions'
import { useQuery } from '@apollo/client'
import { VictoryChart, VictoryLine, VictoryScatter } from 'victory'
import { Row, Col } from 'react-bootstrap'

const Timeseries = () => {
  const data = useQuery(SENSOR_DATA, {
    variables: { sensorName: 'COUT' },
  })

  let measurementList = []
  let graphData = null
  if (data.data) {
    measurementList = data.data.sensorData.map((m) => ({
      ...m,
      datetime: new Date(m.timestamp * 1000),
    }))
    graphData = measurementList.map((m) => ({
      x: m.datetime,
      y: Number(m.value),
    }))
    console.log(graphData)
  }

  return (
    <div>
      <Row className="p-4">
        <h2>Aikasarjat</h2>
      </Row>
      <Row className="p-4">
        <Col>
          <table>
            <tbody>
              <tr>
                <th>timestamp</th>
                <th>value</th>
              </tr>
              {measurementList.map((a) => (
                <tr key={a.timestamp}>
                  <td>{convertDate(a.datetime)}</td>
                  <td>{convertTemp(a.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
        <Col>
          <VictoryChart data={graphData} height={250}>
            <VictoryScatter
              style={{ data: { fill: 'green' } }}
              size={2}
              data={graphData}
            />
            <VictoryLine
              data={graphData}
              interpolation="monotoneX"
              x={'x'}
              y={'y'}
              scale={{ x: 'date' }}
              style={{ data: { stroke: '#c43a31', strokeWidth: 1 } }}
            />
          </VictoryChart>
        </Col>
      </Row>
    </div>
  )
}

export default Timeseries
