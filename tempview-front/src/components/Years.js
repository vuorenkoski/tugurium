import { useEffect, useState } from 'react'
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
import { SENSOR_DATA, ALL_SENSORS, GET_FIRST_TIMESTAMP } from '../queries'
const { COLORS } = require('../util/config')

const currentYear = new Date().getFullYear()

const createYearSeries = (firstTimestamp) => {
  const firstYear = new Date(firstTimestamp * 1000).getFullYear()

  const yearSeries = Array(currentYear - firstYear + 1)
    .fill()
    .map((_, i) => (firstYear + i).toString())
  yearSeries.push('keskiarvo')
  return yearSeries
}

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

const groupByYear = (measurements, firstTimestamp) => {
  let graphData = null
  let min = 0
  let max = 10
  let sum = {}
  let count = {}

  // Create series for every year
  const years = createYearSeries(firstTimestamp)
  graphData = years.map((y) => ({ year: y, measurements: [] }))
  for (let i = 0; i < measurements.length; i++) {
    const date = new Date(measurements[i].timestamp * 1000)
    const year = date.getFullYear()
    date.setFullYear(currentYear)
    const value = Number(measurements[i].value)

    graphData[year - parseInt(years[0])].measurements.push({
      y: value,
      x: date,
    })

    const epoch = measurements[i].timestamp - yearToEpoch(year)
    sum[epoch] = sum[epoch] ? sum[epoch] + value : value
    count[epoch] = count[epoch] ? count[epoch] + 1 : 1
    min = Math.min(min, value)
    max = Math.max(max, value)
  }

  const avgIndex = currentYear - parseInt(years[0]) + 1
  for (const key in sum) {
    // we do not take account the last year of leap year
    if (Number(key) < 365 * 24 * 60 * 60) {
      graphData[avgIndex].measurements.push({
        y: sum[key] / count[key],
        x: (Number(key) + yearToEpoch(currentYear)) * 1000,
      })
    }
  }
  // include only years with data
  graphData = graphData.filter((d) => d.measurements.length > 0)
  return { min, max, graphData }
}

const processData = (sensorData, setData, firstTimestamp) => {
  if (sensorData.length > 0) {
    const measurements = sensorData[0].measurements
    const daily = groupByYear(measurements, firstTimestamp)
    const monthly = monthlyDataFromDaily(daily)
    const unit = sensorData[0].sensorUnit
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

  const firstTimestamp = useQuery(GET_FIRST_TIMESTAMP)

  const sensorData = useQuery(SENSOR_DATA, {
    variables: {
      sensorName: selectedSensor,
      average: 'DAY',
    },
  })
  const sensors = useQuery(ALL_SENSORS)

  useEffect(() => {
    if (firstTimestamp.data && sensorData.data) {
      setSelectedYears([])
      processData(
        sensorData.data.sensorData,
        setData,
        firstTimestamp.data.getFirstTimestamp
      )
    }
  }, [firstTimestamp, sensorData])

  const handleSensorChange = (e) => {
    setSelectedSensor(e.target.value)
    setSelectedDomain({})
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
        <Col>
          <h2>Vuosien välinen vertailu (päivän keskiarvo)</h2>
        </Col>
      </Row>
      <Row className="p-4 pt-0 pb-0">
        <Form>
          <Col>
            <Row>
              <Col className="col-auto border rounded m-3 p-3">
                <Row className="align-items-center">
                  <Col className="col-auto">
                    <h4>Sensori</h4>
                  </Col>
                  <Col className="col-auto">
                    <Form.Select
                      onChange={handleSensorChange.bind(this)}
                      defaultValue="empty"
                    >
                      <option disabled value="empty">
                        -- valitse --
                      </option>
                      {sensors.data &&
                        sensors.data.allSensors.map((s) => (
                          <option key={s.sensorName} value={s.sensorName}>
                            {s.sensorFullname}
                          </option>
                        ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Col>
              <Col className="col-auto border rounded m-3 p-3">
                <Row>
                  <Col>
                    <h4>Datapisteiden yhdistäminen</h4>
                  </Col>
                </Row>
                <Row className="pt-1">
                  <Col className="col-auto p-1">
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
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="border rounded m-3 p-3">
                <Row>
                  <Col>
                    <h4>Vuodet</h4>
                  </Col>
                </Row>
                <Row className="pt-1">
                  {data &&
                    data.daily.graphData.map((d) => (
                      <Col key={d.year} className="col-auto pr-3">
                        <Form.Check
                          type={'checkbox'}
                          id={d.year}
                          label={d.year}
                          defaultValue={false}
                          onChange={handleYearChange.bind(this)}
                        />
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>
          </Col>
        </Form>
      </Row>

      <Row className="p-4 pt-0 border rounded m-3">
        {data && selectedYears.length > 0 && (
          <div>
            <Col className="col-auto ">
              <VictoryChart
                theme={VictoryTheme.material}
                width={1200}
                height={500}
                domain={{
                  y: [data[period].min, data[period].max],
                }}
                scale={{ x: 'time' }}
                containerComponent={
                  <VictoryZoomContainer
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
                    tickLabels: { fontSize: 20, padding: 0 },
                  }}
                />
                <VictoryAxis
                  offsetY={50}
                  orientation="bottom"
                  tickCount={10}
                  label="Aika"
                  style={{
                    axisLabel: { fontSize: 20, padding: 30 },
                    tickLabels: { fontSize: 20, padding: 0 },
                  }}
                />
                <VictoryLegend
                  orientation="horizontal"
                  itemsPerRow={5}
                  gutter={30}
                  x={20}
                  y={0}
                  margin={50}
                  style={{
                    border: { stroke: 'none' },
                    labels: { fontSize: 20 },
                  }}
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
                      style={{ data: { stroke: COLORS[i], strokeWidth: 1 } }}
                    />
                  ))}
              </VictoryChart>
            </Col>
            <Col className="col-auto ">
              <VictoryChart
                width={1200}
                height={120}
                scale={{ x: 'time' }}
                padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
                containerComponent={
                  <VictoryBrushContainer
                    brushDimension="x"
                    brushDomain={selectedDomain}
                    onBrushDomainChange={handleBrush.bind(this)}
                  />
                }
              >
                <VictoryAxis
                  dependentAxis
                  domain={{
                    y: [data[period].min, data[period].max],
                  }}
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
                      style={{ data: { stroke: 'black', strokeWidth: 1 } }}
                    />
                  ))}
              </VictoryChart>
            </Col>
          </div>
        )}
        {!sensorData.data && selectedSensor && (
          <Col className="col-9">
            <p>Lataa tietoja...</p>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Years
