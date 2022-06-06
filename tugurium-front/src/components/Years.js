import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Row, Col, Form } from 'react-bootstrap'
import { SENSOR_DATA, GET_FIRST_TIMESTAMP } from '../graphql/measurement'
import { ALL_SENSORS } from '../graphql/sensor'
import { NETWORK_ERROR, LOADING } from '../util/config'
import Chart from './Chart'

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

const noScale = (x) => x

const monthlyDataFromDaily = (dailyData, isSum) => {
  const currentMonthYear = new Date().getMonth() + new Date().getFullYear() * 12
  let graphData = []
  let min = 0
  let max = 10

  dailyData.graphData.forEach((d) => {
    let result = []
    if (d.measurements.length > 0) {
      const data = d.measurements.map((m) => ({
        value: m.value,
        timestamp: m.timestamp,
        monthYear:
          new Date(m.timestamp * 1000).getMonth() +
          new Date(m.timestamp * 1000).getFullYear() * 12,
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
          const value = isSum ? sum[i] : sum[i] / count[i]
          min = Math.min(min, value)
          max = Math.max(max, value)

          result.push({
            value: value,
            timestamp:
              new Date(
                Math.floor((i + minEpoch) / 12),
                (i + minEpoch) % 12,
                1
              ) / 1000,
          })
        }
      })
    }
    graphData.push({
      legendLabel: d.legendLabel,
      measurements: result,
      scaleFn: noScale,
    })
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
  graphData = years.map((y) => ({
    legendLabel: y,
    measurements: [],
    scaleFn: noScale,
  }))
  for (let i = 0; i < measurements.length; i++) {
    const date = new Date(measurements[i].timestamp * 1000)
    const year = date.getFullYear()
    date.setFullYear(currentYear)
    const value = measurements[i].value

    graphData[year - parseInt(years[0])].measurements.push({
      value: value,
      timestamp: date / 1000,
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
        value: sum[key] / count[key],
        timestamp: Number(key) + yearToEpoch(currentYear),
      })
    }
  }
  // include only years with data
  graphData = graphData.filter((d) => d.measurements.length > 0)
  return { min, max, graphData }
}

const processData = (sensorData, setData, firstTimestamp) => {
  if (sensorData) {
    const daily = groupByYear(sensorData.measurements, firstTimestamp)
    const monthly = monthlyDataFromDaily(daily, sensorData.agrmethod === 'SUM')
    const unit = sensorData.sensorUnit
    const result = { monthly, daily, unit }
    setData(result)
  }
}

const Years = () => {
  const [selectedSensor, setSelectedSensor] = useState('')
  const [zoomDomain, setZoomDomain] = useState({})
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
    setZoomDomain({})
    setData(null)
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
      {sensors.data && (
        <div>
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
                    <Row className="align-items-center pt-2">
                      {data && data.unit && (
                        <Col>Mittayksikkö: {data.unit} </Col>
                      )}
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
                          <Col key={d.legendLabel} className="col-auto pr-3">
                            <Form.Check
                              type={'checkbox'}
                              id={d.legendLabel}
                              label={d.legendLabel}
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
          {data && data[period] && selectedYears.length > 0 && (
            <Chart
              data={data[period].graphData.filter((d) =>
                selectedYears.includes(d.legendLabel)
              )}
              zoomDomain={zoomDomain}
              setZoomDomain={setZoomDomain}
              yDomain={[data[period].min, data[period].max]}
            />
          )}
          {!sensorData.data && selectedSensor && (
            <Row className="p-4">
              <Col className="col-9">
                <p>{LOADING}</p>
              </Col>
            </Row>
          )}
        </div>
      )}
    </div>
  )
}

export default Years
