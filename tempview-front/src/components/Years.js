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
const { FIRST_YEAR, COLORS } = require('../util/config')

const currentYear = new Date().getFullYear()

let years = Array(currentYear - FIRST_YEAR + 1)
  .fill()
  .map((_, i) => (FIRST_YEAR + i).toString())
years.push('keskiarvo')

const yearToEpoch = (year) => {
  const date = new Date(year, 0, 1)
  return date.valueOf() / 1000
}

const monthlyDataFromDaily = (dailyData) => {
  const currentMonthYear = new Date().getMonth() + new Date().getFullYear() * 12
  let graphData = []
  let min = 0
  let max = 10

  dailyData.graphData.forEach((d) => {
    let result = []
    if (d.measurements.length > 0) {
      const data = d.measurements.map((m) => ({
        value: Number(m.y),
        timestamp: m.x,
        monthYear: new Date(m.x).getMonth() + new Date(m.x).getFullYear() * 12,
      }))
      const minEpoch = data.reduce(
        (p, c) => Math.min(p, c.monthYear),
        currentMonthYear
      )
      const maxEpoch = data.reduce((p, c) => Math.max(p, c.monthYear), 0)
      let sum = new Array(maxEpoch - minEpoch + 1).fill(0)
      let count = new Array(maxEpoch - minEpoch + 1).fill(0)
      data.forEach((d) => {
        sum[d.monthYear - minEpoch] += d.value
        count[d.monthYear - minEpoch]++
      })

      sum.forEach((x, i) => {
        if (count[i] > 0) {
          const value = sum[i] / count[i]
          min = Math.min(min, value)
          max = Math.max(max, value)

          result.push({
            y: value,
            x: new Date(
              Math.floor((i + minEpoch) / 12),
              (i + minEpoch) % 12,
              1
            ),
          })
        }
      })
    }
    graphData.push({ year: d.year, measurements: result })
  })
  return { min, max, graphData }
}

const groupByYear = (measurements) => {
  let graphData = null
  let min = 0
  let max = 10
  let sum = {}
  let count = {}

  // Create series for every year
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
    min = Math.min(min, value)
    max = Math.max(max, value)
  }

  const avgIndex = currentYear - FIRST_YEAR + 1
  for (const key in sum) {
    // we do not take account the last year of leap year
    if (Number(key) < 365 * 24 * 60 * 60) {
      graphData[avgIndex].measurements.push({
        y: sum[key] / count[key],
        x: (Number(key) + yearToEpoch(currentYear)) * 1000,
      })
    }
  }
  return { min, max, graphData }
}

const processData = (recData, setData) => {
  if (recData.sensorData.length > 0) {
    const measurements = recData.sensorData[0].measurements
    const daily = groupByYear(measurements)
    const monthly = monthlyDataFromDaily(daily)
    const unit = recData.sensorData[0].sensorUnit
    const result = { monthly, daily, unit }
    setData(result)
  }
}

const Years = () => {
  const [selectedSensor, setSelectedSensor] = useState('')
  const [zoomDomain, setZoomDomain] = useState({})
  const [selectedDomain, setSelectedDomain] = useState({})
  const [selectedYears, setSelectedYears] = useState([])
  const [data, setData] = useState(null)
  const [period, setPeriod] = useState('daily')

  useQuery(SENSOR_DATA, {
    variables: {
      sensorName: selectedSensor,
      average: 'DAY',
      minDate: yearToEpoch(FIRST_YEAR),
      maxDate: yearToEpoch(currentYear + 1),
    },
    onCompleted: (recData) => processData(recData, setData),
  })
  const sensors = useQuery(ALL_SENSORS)

  const handleSensorChange = (e) => {
    setSelectedSensor(e.target.id)
    setZoomDomain({})
    setData(null)
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

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value)
  }

  return (
    <div>
      <Row className="p-4 pb-0">
        <h2>Vuosien välinen vertailu (päivän keskiarvo)</h2>
      </Row>
      <Row className="p-4">
        <Col className="col-3">
          <Form>
            <Row className="p-2">
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
            </Row>
            <Row className="p-2">
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
            </Row>
            <Row className="p-2">
              <h4>Datapisteiden yhdistäminen</h4>
              <Form.Check
                defaultChecked
                type={'radio'}
                id={'day'}
                label={'Päivä'}
                name={'aggregatePeriod'}
                defaultValue={'daily'}
                onChange={handlePeriodChange.bind(this)}
              />
              <Form.Check
                type={'radio'}
                id={'month'}
                label={'Kuukausi'}
                name={'aggregatePeriod'}
                defaultValue={'monthly'}
                onChange={handlePeriodChange.bind(this)}
              />
            </Row>
          </Form>
        </Col>
        {data && (
          <Col className="col-9">
            <VictoryChart
              width={900}
              height={600}
              theme={VictoryTheme.material}
              domain={{
                y: [data[period].min, data[period].max],
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
                label={data.unit}
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
                data={data.daily.graphData
                  .filter((d) => selectedYears.includes(d.year))
                  .map((d, i) => ({
                    name: d.year,
                    symbol: { fill: COLORS[i], type: 'square' },
                  }))}
              />

              {data[period].graphData
                .filter((d) => selectedYears.includes(d.year))
                .map((d, i) => (
                  <VictoryLine
                    key={d.year}
                    data={d.measurements}
                    interpolation="monotoneX"
                    name={d.year}
                    x={'x'}
                    y={'y'}
                    style={{ data: { stroke: COLORS[i] } }}
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
              {data[period].graphData
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
            <p>Lataa tietoja...</p>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Years
