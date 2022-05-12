import { Table, Row, Col, Form } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { convertDateToDate, convertNumber } from '../util/conversions'
import {
  VictoryChart,
  VictoryLine,
  VictoryBrushContainer,
  VictoryZoomContainer,
  VictoryAxis,
  VictoryTheme,
} from 'victory'

import { SENSOR_STATS, DATAPOINTS } from '../queries'

const processData = (data, setMeasurements) => {
  const secondsInDay = 24 * 60 * 60
  const currentEpoch = Math.floor(new Date() / 1000)

  const min = Math.floor(
    data.datapoints.reduce((p, c) => Math.min(p, c.timestamp), currentEpoch) /
      secondsInDay
  )

  const max = Math.floor(
    data.datapoints.reduce((p, c) => Math.max(p, c.timestamp), 0) / secondsInDay
  )

  let mlist = new Array(max - min).fill(0)
  data.datapoints.forEach(
    (d) => (mlist[Math.floor(d.timestamp / secondsInDay) - min] = d.count)
  )

  setMeasurements(
    mlist.map((y, i) => ({ y, x: (i + min) * secondsInDay * 1000 }))
  )
}

const Statistics = () => {
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [zoomDomain, setZoomDomain] = useState({})
  const [selectedDomain, setSelectedDomain] = useState({})
  const [measurements, setMeasurements] = useState(null)

  const sensors = useQuery(SENSOR_STATS)

  useQuery(DATAPOINTS, {
    variables: {
      sensorName: selectedSensor,
    },
    onCompleted: (data) => processData(data, setMeasurements),
  })

  let sensorList = null
  if (sensors.data) {
    sensorList = sensors.data.sensorStats
  }

  const handleSensorChange = (e) => {
    setSelectedSensor(e.target.value)
  }

  const handleZoom = (domain) => {
    setSelectedDomain(domain)
  }

  const handleBrush = (domain) => {
    setZoomDomain(domain)
  }

  return (
    <div>
      <Row className="p-4">
        <h2>Tilastoja</h2>
      </Row>

      <Row className="p-4">
        <h3>Sensorien datapisteiden määrät ja alkupäivä</h3>
        {!sensorList && <h3>Loading...</h3>}

        <Col className="col-6">
          {sensorList && (
            <Table striped>
              <tbody>
                <tr>
                  <th>Sensori</th>
                  <th>lukumäärä</th>
                  <th>Ensimmäinen aikaleima</th>
                </tr>
                {sensorList.map((a, i) => (
                  <tr key={i}>
                    <td>{a.sensor.sensorFullname}</td>
                    <td>{convertNumber(a.count)}</td>
                    <td>{convertDateToDate(a.firstTimestamp)}</td>
                  </tr>
                ))}
                <tr>
                  <td>YHTEENSÄ</td>
                  <td>
                    {convertNumber(sensorList.reduce((p, c) => p + c.count, 0))}
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <Row className="p-4">
        <h3>Sensorin datapisteiden määrät vuorokaudessa aikajanalla</h3>
        {sensorList && (
          <Row className="p-2">
            <Col className="col-3">
              <Form>
                <Form.Select
                  onChange={handleSensorChange.bind(this)}
                  defaultValue="empty"
                >
                  <option disabled value="empty">
                    -- valitse --
                  </option>
                  {sensorList.map((s) => (
                    <option
                      key={s.sensor.sensorName}
                      value={s.sensor.sensorName}
                    >
                      {s.sensor.sensorFullname}
                    </option>
                  ))}
                </Form.Select>
              </Form>
            </Col>
          </Row>
        )}
        {measurements && (
          <div>
            <VictoryChart
              width={900}
              height={300}
              theme={VictoryTheme.material}
              domain={{
                y: [0, measurements.reduce((p, c) => Math.max(p, c.y), 0)],
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
                label="lukumäärä"
                style={{
                  axisLabel: { fontSize: 20, padding: 35 },
                  tickLabels: { fontSize: 15, padding: 0 },
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
              <VictoryLine data={measurements} interpolation="monotoneX" />
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
                domain={[0, 100]}
                standalone={false}
                style={{
                  axis: { stroke: 'transparent' },
                  ticks: { stroke: 'transparent' },
                  tickLabels: { fill: 'transparent' },
                }}
              />
              <VictoryLine
                data={measurements}
                interpolation="monotoneX"
                style={{ data: { stroke: '#c43a31', strokeWidth: 1 } }}
              />
            </VictoryChart>
          </div>
        )}
        {!measurements && selectedSensor && (
          <Col className="col-9">
            <h3>loading...</h3>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Statistics
