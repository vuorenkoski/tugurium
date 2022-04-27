import { useQuery } from '@apollo/client'
import { SENSOR_DATA, ALL_SENSORS } from './queries'
import { convertDate, convertTemp } from './util/conversions'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const Sensors = ({ sensors }) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>name</th>
          <th>description</th>
          <th>unit</th>
        </tr>
        {sensors.map((a) => (
          <tr key={a.sensorName}>
            <td>{a.sensorName}</td>
            <td>{a.sensorFullname}</td>
            <td>{a.sensorUnit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Home = () => {
  return <div></div>
}

const Timeseries = () => {
  const data = useQuery(SENSOR_DATA, {
    variables: { sensorName: 'CINS' },
  })

  let measurementList = []
  if (data.data) {
    measurementList = data.data.sensorData.map((m) => ({
      ...m,
      datetime: new Date(m.timestamp * 1000),
    }))
  }

  return (
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
  )
}

const App = () => {
  const sensors = useQuery(ALL_SENSORS)

  let sensorList = []
  if (sensors.data) {
    sensorList = sensors.data.allSensors
  }

  const padding = {
    padding: 5,
  }

  return (
    <Router>
      <div>
        <b>TEMPVIEW</b>
        <Link style={padding} to="/">
          Lämpötilat nyt
        </Link>
        <Link style={padding} to="/sensors">
          Sensorit
        </Link>
        <Link style={padding} to="/timeseries">
          Aikasarjat
        </Link>
        <Link style={padding} to="/annual">
          Vuosivertailu
        </Link>
        <Link style={padding} to="/commands">
          Komennot
        </Link>
      </div>

      <Routes>
        <Route path="/sensors" element={<Sensors sensors={sensorList} />} />
        <Route path="/" element={<Home />} />
        <Route path="/timeseries" element={<Timeseries />} />
      </Routes>
    </Router>
  )
}

export default App
