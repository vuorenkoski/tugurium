import { useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  VictoryChart,
  VictoryLine,
  VictoryBrushContainer,
  VictoryZoomContainer,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
} from 'victory'
import { Row, Col, Form } from 'react-bootstrap'
import { SENSOR_DATA, ALL_SENSORS } from '../queries'
const { FIRST_YEAR } = require('../util/config')

const currentYear = new Date().getFullYear()

let years = Array(currentYear - FIRST_YEAR + 1)
  .fill()
  .map((_, i) => (FIRST_YEAR + i).toString())
years.push('keskiarvo')

const yearToEpoch = (year) => {
  const date = new Date(year, 0, 1)
  return date.valueOf() / 1000
}

const processData = (data, setData, setMax, setMin) => {
  let graphData = null
  let minumum = 0
  let maximum = 25
  if (data.sensorData.length > 0) {
    let sum = {}
    let count = {}
    const measurements = data.sensorData[0].measurements
    graphData = years.map((y) => ({ year: y, measurements: [] }))
    for (let i = 0; i < measurements.length; i++) {
      const date = new Date(measurements[i].timestamp * 1000)
      const year = date.getFullYear()
      date.setFullYear(currentYear)
      const value = Number(measurements[i].value)
      graphData[year - FIRST_YEAR].measurements.push({
        y: value,
        x: date,
      })
      const epoch = measurements[i].timestamp - yearToEpoch(year)
      sum[epoch] = sum[epoch] ? sum[epoch] + value : value
      count[epoch] = count[epoch] ? count[epoch] + 1 : 1
      minumum = Math.min(minumum, value)
      maximum = Math.max(maximum, value)
    }
    const avgIndex = currentYear - FIRST_YEAR + 1
    for (const key in sum) {
      graphData[avgIndex].measurements.push({
        y: sum[key] / count[key],
        x: (Number(key) + yearToEpoch(currentYear)) * 1000,
      })
    }
    setData(graphData)
    setMin(minumum)
    setMax(maximum)
  }
}

const Years = () => {
  const [selectedSensor, setSelectedSensor] = useState('')
  const [zoomDomain, setZoomDomain] = useState({})
  const [selectedDomain, setSelectedDomain] = useState({})
  const [selectedYears, setSelectedYears] = useState([])
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(10)
  const [data, setData] = useState(null)

  useQuery(SENSOR_DATA, {
    variables: {
      sensorName: selectedSensor,
      average: 'DAY',
      minDate: yearToEpoch(FIRST_YEAR),
      maxDate: yearToEpoch(currentYear + 1),
    },
    onCompleted: (data) => processData(data, setData, setMax, setMin),
  })
  const sensors = useQuery(ALL_SENSORS)

  const handleSensorChange = (e) => {
    setSelectedSensor(e.target.id)
    setZoomDomain({})
  }

  const handleZoom = (domain) => {
    setSelectedDomain(domain)
  }

  const handleBrush = (domain) => {
    setZoomDomain(domain)
  }

  const handleYearChange = (e) => {
    if (e.target.checked) {
      setSelectedYears(selectedYears.concat(e.target.id))
    } else {
      setSelectedYears(selectedYears.filter((i) => i !== e.target.id))
    }
  }

  const colors = ['black', 'red', 'blue', 'green']

  return (
    <div>
      <Row className="p-4">
        <h2>Vuosien välinen vertailu (päivän keskiarvo)</h2>
      </Row>
      <Row className="p-4">
        <Col className="col-3">
          <Form>
            <h3>Sensorit</h3>
            {sensors.data &&
              sensors.data.allSensors.map((s) => (
                <div key={s.sensorName}>
                  <Form.Check
                    type={'radio'}
                    id={s.sensorName}
                    label={s.sensorFullname}
                    name={'sensor'}
                    defaultValue={false}
                    onChange={handleSensorChange.bind(this)}
                  />
                </div>
              ))}
            <h3>Vuodet</h3>
            {years.map((y) => (
              <div key={y}>
                <Form.Check
                  type={'checkbox'}
                  id={y}
                  label={y}
                  defaultValue={false}
                  onChange={handleYearChange.bind(this)}
                />
              </div>
            ))}
          </Form>
        </Col>
        {data && (
          <Col className="col-9">
            <VictoryChart
              width={900}
              height={600}
              theme={VictoryTheme.material}
              domain={{
                y: [min, max],
              }}
              scale={{ x: 'time' }}
              containerComponent={
                <VictoryZoomContainer
                  responsive={false}
                  zoomDimension="x"
                  zoomDomain={zoomDomain}
                  onZoomDomainChange={handleZoom.bind(this)}
                />
              }
            >
              <VictoryAxis
                dependentAxis
                crossAxis={false}
                label="celsius"
                style={{
                  axisLabel: { fontSize: 20, padding: 30 },
                  tickLabels: { fontSize: 15, padding: 5 },
                }}
              />
              <VictoryAxis
                offsetY={50}
                tickCount={10}
                label="Aika"
                style={{
                  axisLabel: { fontSize: 20, padding: 30 },
                  tickLabels: { fontSize: 15, padding: 5 },
                }}
              />
              <VictoryLegend
                x={700}
                y={0}
                orientation="vertical"
                style={{ border: { stroke: 'black' }, title: { fontSize: 20 } }}
                data={data
                  .filter((d) => selectedYears.includes(d.year))
                  .map((d, i) => ({
                    name: d.year,
                    symbol: { fill: colors[i], type: 'square' },
                  }))}
              />

              {data
                .filter((d) => selectedYears.includes(d.year))
                .map((d, i) => (
                  <VictoryLine
                    key={d.year}
                    data={d.measurements}
                    interpolation="monotoneX"
                    name={d.year}
                    x={'x'}
                    y={'y'}
                    style={{ data: { stroke: colors[i] } }}
                  />
                ))}
            </VictoryChart>
            <VictoryChart
              width={900}
              height={90}
              scale={{ x: 'time' }}
              padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
              containerComponent={
                <VictoryBrushContainer
                  responsive={false}
                  brushDimension="x"
                  brushDomain={selectedDomain}
                  onBrushDomainChange={handleBrush.bind(this)}
                />
              }
            >
              <VictoryAxis
                dependentAxis
                standalone={false}
                style={{
                  axis: { stroke: 'transparent' },
                  ticks: { stroke: 'transparent' },
                  tickLabels: { fill: 'transparent' },
                }}
              />
              {data
                .filter((d) => selectedYears.includes(d.year))
                .map((d) => (
                  <VictoryLine
                    key={d.year}
                    data={d.measurements}
                    interpolation="monotoneX"
                    x={'x'}
                    y={'y'}
                    style={{ data: { stroke: '#c43a31', strokeWidth: 1 } }}
                  />
                ))}
            </VictoryChart>
          </Col>
        )}
        {!data && selectedSensor && (
          <Col className="col-9">
            <h3>loading...</h3>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Years
