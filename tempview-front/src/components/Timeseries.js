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

import { SENSOR_DATA } from '../queries'

const Timeseries = ({ sensors }) => {
  const [checked, setChecked] = useState([])
  const [zoomDomain, setZoomDomain] = useState({})
  const [selectedDomain, setSelectedDomain] = useState({})
  const data = useQuery(SENSOR_DATA, {
    variables: { sensorName: checked },
  })

  let graphData = null
  if (data.data && data.data.sensorData.length > 0) {
    graphData = data.data.sensorData
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

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setChecked(checked.concat(e.target.id))
    } else {
      setChecked(checked.filter((i) => i !== e.target.id))
    }
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
            {sensors.map((s) => (
              <div key={s.sensorName}>
                <Form.Check
                  type={'checkbox'}
                  id={s.sensorName}
                  label={s.sensorFullname}
                  defaultValue={false}
                  onChange={handleCheckboxChange.bind(this)}
                />
              </div>
            ))}
          </Form>
        </Col>
        {graphData && (
          <Col className="col-9">
            <VictoryChart
              width={900}
              height={600}
              theme={VictoryTheme.material}
              domain={{
                y: [
                  graphData.reduce((p, c) => Math.min(p, c.min), 0) - 5,
                  graphData.reduce((p, c) => Math.max(p, c.max), 25),
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
                data={graphData.map((d, i) => ({
                  name: d.sensorFullname,
                  symbol: { fill: colors[i], type: 'square' },
                }))}
              />

              {graphData.map((d, i) => (
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
                domain={[graphData.reduce((p, c) => Math.min(p, c.min), 0), 30]}
                standalone={false}
                style={{
                  axis: { stroke: 'transparent' },
                  ticks: { stroke: 'transparent' },
                  tickLabels: { fill: 'transparent' },
                }}
              />
              {graphData.map((d) => (
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
      </Row>
    </div>
  )
}

export default Timeseries
