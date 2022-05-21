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
  if (data.datapoints.length > 0) {
    const min = Math.floor(
      data.datapoints.reduce((p, c) => Math.min(p, c.timestamp), currentEpoch) /
        secondsInDay
    )

    const max = Math.floor(
      data.datapoints.reduce((p, c) => Math.max(p, c.timestamp), 0) /
        secondsInDay
    )

    let mlist = new Array(max - min).fill(0)
    data.datapoints.forEach(
      (d) => (mlist[Math.floor(d.timestamp / secondsInDay) - min] = d.count)
    )

    setMeasurements(
      mlist.map((y, i) => ({ y, x: (i + min) * secondsInDay * 1000 }))
    )
  } else {
    setMeasurements([])
  }
}

const Statistics = () => {
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [zoomDomain, setZoomDomain] = useState({})
  const [measurements, setMeasurements] = useState(null)

  const sensors = useQuery(SENSOR_STATS)

  useQuery(DATAPOINTS, {
    variables: {
      sensorName: selectedSensor,
    },
    onCompleted: (data) => processData(data, setMeasurements),
  })

  const handleSensorChange = (e) => {
    setSelectedSensor(e.target.value)
    setMeasurements(null)
  }

  const handleZoom = (domain) => {
    setZoomDomain(domain)
  }

  return (
    <div>
      <Row className="p-4">
        <Col>
          <h2>Tilastoja</h2>
        </Col>
      </Row>

      <Row className="p-4 pb-2 pt-0">
        <h4>Sensorien datapisteiden määrät ja alkupäivä</h4>
      </Row>

      <Row className="p-4 pt-0">
        {!sensors.data && <Col>Ladataan...</Col>}

        {sensors.data && (
          <Col className="col-auto">
            <Table striped>
              <tbody>
                <tr>
                  <th>Sensori</th>
                  <th>lukumäärä</th>
                  <th>Ensimmäinen aikaleima</th>
                </tr>
                {sensors.data.sensorStats.map((s) => (
                  <tr key={s.sensor.sensorName}>
                    <td>{s.sensor.sensorFullname}</td>
                    <td>{convertNumber(s.count)}</td>
                    <td>{convertDateToDate(s.firstTimestamp)}</td>
                  </tr>
                ))}
                <tr>
                  <td>YHTEENSÄ</td>
                  <td>
                    {convertNumber(
                      sensors.data.sensorStats.reduce((p, c) => p + c.count, 0)
                    )}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        )}
      </Row>

      <Row className="p-4 pt-2 pb-2">
        <Col>
          <h4>Sensorin datapisteiden määrät vuorokaudessa</h4>
        </Col>
      </Row>

      <Row className="p-4 pt-0">
        {!sensors.data && <Col>Ladataan...</Col>}
        {sensors.data && (
          <Col className="col-auto">
            <Form>
              <Form.Select
                onChange={handleSensorChange.bind(this)}
                defaultValue="empty"
              >
                <option disabled value="empty">
                  -- valitse --
                </option>
                {sensors.data.sensorStats.map((s) => (
                  <option key={s.sensor.sensorName} value={s.sensor.sensorName}>
                    {s.sensor.sensorFullname}
                  </option>
                ))}
              </Form.Select>
            </Form>
          </Col>
        )}
      </Row>

      <Row className="p-4">
        {measurements && measurements.length > 0 && (
          <div>
            <Col className="col-auto">
              <VictoryChart
                width={1200}
                height={400}
                theme={VictoryTheme.material}
                domain={{
                  y: [0, measurements.reduce((p, c) => Math.max(p, c.y), 0)],
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
                  label="lukumäärä"
                  style={{
                    axisLabel: { fontSize: 20, padding: 30 },
                    tickLabels: { fontSize: 20, padding: 0 },
                  }}
                />
                <VictoryAxis
                  offsetY={50}
                  tickCount={10}
                  style={{
                    axisLabel: { fontSize: 20, padding: 30 },
                    tickLabels: { fontSize: 20, padding: 5 },
                  }}
                />
                <VictoryLine
                  data={measurements}
                  interpolation="monotoneX"
                  style={{ data: { stroke: 'black', strokeWidth: 1 } }}
                />
              </VictoryChart>
            </Col>

            <Col className="col-auto ">
              <VictoryChart
                width={1200}
                height={170}
                scale={{ x: 'time' }}
                domain={{
                  y: [0, measurements.reduce((p, c) => Math.max(p, c.y), 0)],
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
                <VictoryLine
                  data={measurements}
                  interpolation="monotoneX"
                  style={{ data: { stroke: 'black', strokeWidth: 1 } }}
                />
              </VictoryChart>
            </Col>
          </div>
        )}
        {measurements && measurements.length === 0 && (
          <Col className="col-9">
            <p>ei datapisteitä</p>
          </Col>
        )}
        {!measurements && selectedSensor && (
          <Col className="col-9">
            <p>lataa tietoja...</p>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Statistics
