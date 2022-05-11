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

import { ALL_SENSORS, SENSOR_DATA } from '../queries'
const { FIRST_YEAR } = require('../util/config')

const currentYear = new Date().getFullYear()
const years = Array(currentYear - FIRST_YEAR + 1)
  .fill()
  .map((_, i) => currentYear - i)

const yearToEpoch = (year) => {
  const date = new Date(year, 0, 1)
  return date.valueOf() / 1000
}

const processData = (data, setData) => {
  let graphData = null
  if (data.sensorData.length > 0) {
    graphData = data.sensorData
      .filter((d) => d.measurements.length > 0)
      .map((d) => ({
        sensorFullname: d.sensorFullname,
        unit: d.unit,
        min: d.measurements.reduce((p, c) => Math.min(p, c.value), 0),
        max: d.measurements.reduce((p, c) => Math.max(p, c.value), 25),
        measurements: d.measurements.map((m) => ({
          y: Number(m.value),
          x: new Date(m.timestamp * 1000),
        })),
      }))
  }
  setData(graphData)
}

const Timeseries = () => {
  const [selectedSensors, setSelectedSensors] = useState([])
  const [average, setAverage] = useState('HOUR')
  const [year, setYear] = useState(currentYear)
  const [zoomDomain, setZoomDomain] = useState({})
  const [selectedDomain, setSelectedDomain] = useState({})
  const [data, setData] = useState(null)

  useQuery(SENSOR_DATA, {
    variables: {
      sensorName: selectedSensors,
      average: average,
      minDate: yearToEpoch(year),
      maxDate: yearToEpoch(year + 1),
    },
    onCompleted: (data) => processData(data, setData),
  })

  const sensors = useQuery(ALL_SENSORS)

  const handleSensorChange = (e) => {
    if (e.target.checked) {
      setSelectedSensors(selectedSensors.concat(e.target.id))
    } else {
      setSelectedSensors(selectedSensors.filter((i) => i !== e.target.id))
    }
  }

  const handleRadioChange = (e) => {
    setAverage(e.target.value)
  }

  const handleYearChange = (e) => {
    setYear(Number(e.target.value))
  }

  const handleZoom = (domain) => {
    setSelectedDomain(domain)
  }

  const handleBrush = (domain) => {
    setZoomDomain(domain)
  }

  const colors = ['black', 'red', 'blue', 'green']

  return (
    <div>
      <Row className="p-4">
        <h2>Aikasarjat</h2>
      </Row>
      <Row className="p-4">
        <Col className="col-3">
          <Form>
            <h4>Sensorit</h4>
            {sensors.data &&
              sensors.data.allSensors.map((s) => (
                <div key={s.sensorName}>
                  <Form.Check
                    type={'checkbox'}
                    id={s.sensorName}
                    label={s.sensorFullname}
                    defaultValue={false}
                    onChange={handleSensorChange.bind(this)}
                  />
                </div>
              ))}
            <h4>Datapisteiden yhdistäminen</h4>
            <Form.Check
              type={'radio'}
              id={'none'}
              label={'Kaikki'}
              name={'average'}
              defaultValue={'NO'}
              onChange={handleRadioChange.bind(this)}
            />
            <Form.Check
              defaultChecked
              type={'radio'}
              id={'hour'}
              label={'Tunti'}
              name={'average'}
              defaultValue={'HOUR'}
              onChange={handleRadioChange.bind(this)}
            />
            <Form.Check
              type={'radio'}
              id={'day'}
              label={'Päivä'}
              name={'average'}
              defaultValue={'DAY'}
              onChange={handleRadioChange.bind(this)}
            />
            <h4>Vuosi</h4>
            <Form.Select
              aria-label="Default select example"
              onChange={handleYearChange.bind(this)}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Form.Select>
          </Form>
        </Col>
        {data && (
          <Col className="col-9">
            <VictoryChart
              width={900}
              height={600}
              theme={VictoryTheme.material}
              domain={{
                y: [
                  data.reduce((p, c) => Math.min(p, c.min), 0) - 5,
                  data.reduce((p, c) => Math.max(p, c.max), 25),
                ],
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
                data={data.map((d, i) => ({
                  name: d.sensorFullname,
                  symbol: { fill: colors[i], type: 'square' },
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
                domain={[data.reduce((p, c) => Math.min(p, c.min), 0), 30]}
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
                  style={{ data: { stroke: '#c43a31', strokeWidth: 1 } }}
                />
              ))}
            </VictoryChart>
          </Col>
        )}
        {!data && selectedSensors.length > 0 && (
          <Col className="col-9">
            <h3>loading...</h3>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Timeseries
