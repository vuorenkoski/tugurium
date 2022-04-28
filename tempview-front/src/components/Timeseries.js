import { SENSOR_DATA } from '../queries'
import { convertDate, convertTemp } from '../util/conversions'
import { useQuery } from '@apollo/client'
import { VictoryChart, VictoryLine, VictoryScatter } from 'victory'

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
      y: m.value,
    }))
    console.log(graphData)
  }

  return (
    <div>
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
      <VictoryChart data={graphData} height={250}>
        <VictoryScatter
          style={{ data: { fill: 'green' } }}
          size={2}
          data={graphData}
        />
        <VictoryLine
          data={graphData}
          interpolation="cardinal"
          x={'x'}
          y={'y'}
          scale={{ x: 'date' }}
          style={{ data: { stroke: '#c43a31', strokeWidth: 1 } }}
        />
      </VictoryChart>
    </div>
  )
}

export default Timeseries
