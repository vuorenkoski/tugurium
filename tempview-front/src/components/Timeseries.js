import { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import {
  VictoryChart,
  VictoryLine,
  VictoryBrushContainer,
  VictoryZoomContainer,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
  VictoryVoronoiContainer,
  createContainer,
} from 'victory'
import { Row, Col, Form } from 'react-bootstrap'

import { ALL_SENSORS, GET_FIRST_TIMESTAMP, SENSOR_DATA } from '../queries'
import { convertDate } from '../util/conversions'
const { COLORS } = require('../util/config')
const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi')

const createYearSeries = (data) => {
  const yearSeries = []
  const currentEpoch = Math.floor(new Date().valueOf() / 1000)
  yearSeries.push({
    label: 'Viimeinen viikko',
    minEpoch: currentEpoch - 60 * 60 * 24 * 7,
    maxEpoch: currentEpoch,
  })
  yearSeries.push({
    label: 'viimeiset 2kk',
    minEpoch: currentEpoch - 60 * 60 * 24 * 30 * 2,
    maxEpoch: currentEpoch,
  })
  yearSeries.push({
    label: 'viimeiset 6kk',
    minEpoch: currentEpoch - 60 * 60 * 24 * 30 * 6,
    maxEpoch: currentEpoch,
  })
  let y = new Date().getFullYear()
  const firstYear = new Date(data.getFirstTimestamp * 1000).getFullYear()
  while (y >= firstYear) {
    yearSeries.push({
      label: y.toString(),
      minEpoch: yearToEpoch(y),
      maxEpoch: yearToEpoch(y + 1),
    })
    y--
  }
  return yearSeries
}

const yearToEpoch = (year) => {
  const date = new Date(year, 0, 1)
  return Math.floor(date.valueOf() / 1000)
}

const scaleUp = (x) => x * 10
const scaleDown = (x) => x / 10
const noScale = (x) => x

const processData = (data) => {
  if (data.sensorData && data.sensorData.measurements.length > 1) {
    let scaleTxt = ''
    let scaleFn = noScale
    const min = data.sensorData.measurements.reduce(
      (p, c) => Math.min(p, c.value),
      0
    )
    const max = data.sensorData.measurements.reduce(
      (p, c) => Math.max(p, c.value),
      0
    )
    if (max > 70) {
      scaleFn = scaleDown
      scaleTxt = ' /10'
    }
    if (max < 4 && max > 0) {
      scaleFn = scaleUp
      scaleTxt = ' x10'
    }
    const resp = {
      legendLabel: `${data.sensorData.sensorFullname} (${data.sensorData.sensorUnit}${scaleTxt})`,
      sensorName: data.sensorData.sensorName,
      min,
      max: scaleFn(max),
      scaleFn,
      measurements: data.sensorData.measurements,
    }
    return resp
  }
  return null
}

const Timeseries = () => {
  const [selectedSensors, setSelectedSensors] = useState([])
  const [years, setYears] = useState([])
  const [period, setPeriod] = useState('HOUR')
  const [year, setYear] = useState(null)
  const [zoomDomain, setZoomDomain] = useState({})
  const [data, setData] = useState([])

  useQuery(GET_FIRST_TIMESTAMP, {
    onCompleted: (data) => {
      const series = createYearSeries(data)
      setYears(series)
      setYear(series[0])
    },
  })

  const [getSensorData, { loading }] = useLazyQuery(SENSOR_DATA)

  const sensors = useQuery(ALL_SENSORS)

  const handleSensorChange = (e) => {
    if (e.target.checked) {
      setSelectedSensors(selectedSensors.concat(e.target.id))
      getSensorData({
        variables: {
          sensorName: e.target.id,
          average: period,
          minDate: year.minEpoch,
          maxDate: year.maxEpoch,
        },
        onCompleted: (response) => {
          const processedData = processData(response)
          if (processedData) setData(data.concat(processedData))
        },
      })
    } else {
      setSelectedSensors(selectedSensors.filter((i) => i !== e.target.id))
      setData(data.filter((d) => d.sensorName !== e.target.id))
    }
  }

  const handlePeriodChange = async (e) => {
    setPeriod(e.target.value)
    const graphData = []
    for (let i in selectedSensors) {
      const sensor = selectedSensors[i]
      const resp = await getSensorData({
        variables: {
          sensorName: sensor,
          average: e.target.value,
          minDate: year.minEpoch,
          maxDate: year.maxEpoch,
        },
      })
      const processedData = processData(resp.data)
      if (processedData) graphData.push(processedData)
    }
    setData(graphData)
    setZoomDomain({})
  }

  const handleYearChange = async (e) => {
    const value = years[Number(e.target.value)]
    setYear(value)
    const graphData = []
    for (let i in selectedSensors) {
      const sensor = selectedSensors[i]
      const resp = await getSensorData({
        variables: {
          sensorName: sensor,
          average: period,
          minDate: value.minEpoch,
          maxDate: value.maxEpoch,
        },
      })
      const processedData = processData(resp.data)
      if (processedData) graphData.push(processedData)
    }
    setData(graphData)
    setZoomDomain({})
  }

  const handleZoom = (domain) => {
    setZoomDomain(domain)
  }

  return (
    <div>
      <Row className="p-4 pb-0">
        <Col>
          <h2>Aikasarjat</h2>
        </Col>
      </Row>
      <Row className="p-4 pt-0 pb-0">
        <Form>
          <Col>
            <Row>
              <Col className="col-auto border rounded m-3 p-3">
                <Row>
                  <Col>
                    <h4>Datapisteiden yhdistäminen</h4>
                  </Col>
                </Row>
                <Row className="pt-1">
                  <Col className="col-auto p-1">
                    <Form.Check
                      type={'radio'}
                      id={'none'}
                      label={'Ei yhdistetä (hidas)  '}
                      name={'aggregatePeriod'}
                      defaultValue={'NO'}
                      onChange={handlePeriodChange.bind(this)}
                    />
                  </Col>
                  <Col className="col-auto p-1">
                    <Form.Check
                      defaultChecked
                      type={'radio'}
                      id={'hour'}
                      label={'Tunti'}
                      name={'aggregatePeriod'}
                      defaultValue={'HOUR'}
                      onChange={handlePeriodChange.bind(this)}
                    />
                  </Col>
                  <Col className="col-auto p-1">
                    <Form.Check
                      type={'radio'}
                      id={'day'}
                      label={'Päivä'}
                      name={'aggregatePeriod'}
                      defaultValue={'DAY'}
                      onChange={handlePeriodChange.bind(this)}
                    />
                  </Col>
                </Row>
              </Col>
              <Col className="col-auto border rounded m-3 p-3">
                <Row className="align-items-center">
                  <Col className="col-auto">
                    <h4>Ajanjakso</h4>
                  </Col>
                </Row>
                <Row className="align-items-center">
                  <Col className="col-auto">
                    <Form.Select onChange={handleYearChange.bind(this)}>
                      {years &&
                        years.map((y, i) => (
                          <option key={y.label} value={i}>
                            {y.label}
                          </option>
                        ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="border rounded m-3 p-3">
                <Row>
                  <Col>
                    <h4>Sensorit</h4>
                  </Col>
                </Row>
                <Row className="pt-1">
                  {sensors.data &&
                    sensors.data.allSensors.map((s) => (
                      <Col key={s.sensorName} className="col-auto pr-3">
                        <Form.Check
                          type={'checkbox'}
                          id={s.sensorName}
                          label={s.sensorFullname}
                          defaultValue={false}
                          onChangeCapture={handleSensorChange.bind(this)}
                        />
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>
          </Col>
        </Form>
      </Row>
      <Row className="p-4 pt-0 pb-0">
        <Col>
          {loading && <div>Ladataan dataa palvelimelta...</div>}
          {!loading && <div> &nbsp;</div>}
        </Col>
      </Row>
      <Row className="p-4 pt-0 border rounded m-3">
        {data && data.length > 0 && (
          <div>
            <Col className="col-auto ">
              <VictoryChart
                theme={VictoryTheme.material}
                width={1200}
                height={500}
                domain={{
                  y: [
                    data.reduce((p, c) => Math.min(p, c.min), 0),
                    data.reduce((p, c) => Math.max(p, c.max), 0),
                  ],
                }}
                scale={{ x: 'time' }}
                containerComponent={
                  <VictoryZoomVoronoiContainer
                    zoomDimension="x"
                    zoomDomain={zoomDomain}
                    onZoomDomainChange={handleZoom.bind(this)}
                    labels={({ datum }) =>
                      `value: ${datum.value.toFixed(1)}\n${convertDate(
                        datum.timestamp * 1000
                      )}`
                    }
                  />
                }
              >
                <VictoryAxis
                  dependentAxis
                  crossAxis={false}
                  style={{
                    axisLabel: { fontSize: 20, padding: 30 },
                    tickLabels: { fontSize: 20, padding: 0 },
                  }}
                />
                <VictoryAxis
                  offsetY={50}
                  orientation="bottom"
                  tickCount={10}
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
                  data={data.map((d, i) => ({
                    name: d.legendLabel,
                    symbol: { fill: COLORS[i], type: 'square' },
                  }))}
                />

                {data.map((d, i) => (
                  <VictoryLine
                    key={i}
                    data={d.measurements}
                    interpolation="monotoneX"
                    x={(m) => m.timestamp * 1000}
                    y={(m) => d.scaleFn(m.value)}
                    style={{ data: { stroke: COLORS[i], strokeWidth: 1 } }}
                  />
                ))}
              </VictoryChart>
            </Col>

            <Col className="col-auto ">
              <VictoryChart
                width={1200}
                height={170}
                scale={{ x: 'time' }}
                domain={{
                  y: [
                    data.reduce((p, c) => Math.min(p, c.min), 0),
                    data.reduce((p, c) => Math.max(p, c.max), 0),
                  ],
                }}
                containerComponent={
                  <VictoryBrushContainer
                    brushDimension="x"
                    brushDomain={zoomDomain}
                    onBrushDomainChange={handleZoom.bind(this)}
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
                {data.map((d) => (
                  <VictoryLine
                    key={d.sensorName}
                    data={d.measurements}
                    interpolation="monotoneX"
                    x={(m) => m.timestamp * 1000}
                    y={(m) => d.scaleFn(m.value)}
                    style={{ data: { stroke: 'black', strokeWidth: 1 } }}
                  />
                ))}
              </VictoryChart>
            </Col>
          </div>
        )}
      </Row>
    </div>
  )
}

export default Timeseries
