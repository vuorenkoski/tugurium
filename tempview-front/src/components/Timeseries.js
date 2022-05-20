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

import { ALL_SENSORS, GET_FIRST_TIMESTAMP, SENSOR_DATA } from '../queries'
const { COLORS } = require('../util/config')

const currentYear = new Date().getFullYear()

const createYearSeries = (data, setYears) => {
  const yearSeries = Array(
    currentYear - new Date(data.getFirstTimestamp * 1000).getFullYear() + 1
  )
    .fill()
    .map((_, i) => currentYear - i)
  setYears(yearSeries)
}

const yearToEpoch = (year) => {
  const date = new Date(year, 0, 1)
  return date.valueOf() / 1000
}

const processData = (recData, setData, setAxisLabel) => {
  let graphData = null
  let units = ''
  if (recData.sensorData.length > 0) {
    graphData = recData.sensorData
      .filter((d) => d.measurements.length > 0)
      .map((d) => {
        let scaleFn = (x) => x
        let scaleTxt = ''
        const max = d.measurements.reduce((p, c) => Math.max(p, c.value), 0)
        if (max > 70) {
          scaleFn = (x) => x / 10
          scaleTxt = ' /10'
        }
        if (max < 4 && max > 0) {
          scaleFn = (x) => x * 10
          scaleTxt = ' x10'
        }
        return {
          sensorFullname: d.sensorFullname + scaleTxt,
          unit: d.sensorUnit,
          min: d.measurements.reduce((p, c) => Math.min(p, c.value), 0),
          max: scaleFn(max),
          measurements: d.measurements.map((m) => ({
            y: scaleFn(Number(m.value)),
            x: new Date(m.timestamp * 1000),
          })),
        }
      })
    const unitList = graphData.reduce(
      (p, c) => (p.includes(c.unit) ? p : p.concat(c.unit)),
      []
    )
    units = unitList.reduce((p, c) => p.concat(c + ', '), '').slice(0, -2)
  }
  setAxisLabel(units)
  setData(graphData)
}

const Timeseries = () => {
  const [selectedSensors, setSelectedSensors] = useState([])
  const [years, setYears] = useState([currentYear])
  const [period, setPeriod] = useState('HOUR')
  const [year, setYear] = useState(currentYear)
  const [zoomDomain, setZoomDomain] = useState({})
  const [selectedDomain, setSelectedDomain] = useState({})
  const [data, setData] = useState(null)
  const [axisLabel, setAxisLabel] = useState(null)

  useQuery(GET_FIRST_TIMESTAMP, {
    onCompleted: (data) => createYearSeries(data, setYears),
  })

  useQuery(SENSOR_DATA, {
    variables: {
      sensorName: selectedSensors,
      average: period,
      minDate: yearToEpoch(year),
      maxDate: yearToEpoch(year + 1),
    },
    onCompleted: (recData) => processData(recData, setData, setAxisLabel),
  })

  const sensors = useQuery(ALL_SENSORS)

  const handleSensorChange = (e) => {
    if (e.target.checked) {
      setSelectedSensors(selectedSensors.concat(e.target.id))
    } else {
      setSelectedSensors(selectedSensors.filter((i) => i !== e.target.id))
    }
    setData(null)
  }

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value)
    setSelectedDomain({})
    setZoomDomain({})
    setData(null)
  }

  const handleYearChange = (e) => {
    setSelectedDomain({})
    setZoomDomain({})
    setYear(Number(e.target.value))
    setData(null)
  }

  const handleZoom = (domain) => {
    setSelectedDomain(domain)
  }

  const handleBrush = (domain) => {
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
                          onChange={handleSensorChange.bind(this)}
                        />
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>
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
                      label={'Kaikki'}
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
                    <h4>Vuosi</h4>
                  </Col>
                  <Col className="col-auto">
                    <Form.Select onChange={handleYearChange.bind(this)}>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Form>
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
                  label={axisLabel}
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
                  data={data.map((d, i) => ({
                    name: d.sensorFullname,
                    symbol: { fill: COLORS[i], type: 'square' },
                  }))}
                />

                {data.map((d, i) => (
                  <VictoryLine
                    key={i}
                    data={d.measurements}
                    interpolation="monotoneX"
                    name={d.sensorFullname}
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
                  domain={[
                    data.reduce((p, c) => Math.min(p, c.min), 0),
                    data.reduce((p, c) => Math.max(p, c.max), 0),
                  ]}
                  standalone={false}
                  style={{
                    axis: { stroke: 'transparent' },
                    ticks: { stroke: 'transparent' },
                    tickLabels: { fill: 'transparent' },
                  }}
                />
                {data.map((d) => (
                  <VictoryLine
                    key={d.sensorFullname}
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
        {!data && selectedSensors.length > 0 && (
          <Col className="col-9">
            <p>Lataa tietoja...</p>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Timeseries
