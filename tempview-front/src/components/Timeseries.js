import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { VictoryChart, VictoryLine, VictoryScatter } from 'victory'
import { Row, Col, Form } from 'react-bootstrap'

import { SENSOR_DATA } from '../queries'
//import { convertDate, convertTemp } from '../util/conversions'

const Timeseries = ({ sensors }) => {
  // let s = sensors.reduce((p, c) => ({ ...p, [c.sensorName]: false }), {})
  const [checked, setChecked] = useState([])
  console.log(checked[0])
  const data = useQuery(SENSOR_DATA, {
    variables: { sensorName: checked[0] },
  })

  let graphData = null
  if (data.data && data.data.sensorData.length > 0) {
    graphData = data.data.sensorData.map((m) => ({
      y: Number(m.value),
      x: new Date(m.timestamp * 1000),
    }))
  }

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setChecked(checked.concat(e.target.id))
    } else {
      setChecked(checked.filter((i) => i !== e.target.id))
    }
    console.log(checked)
  }

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
            <VictoryChart data={graphData} height={250}>
              <VictoryScatter
                style={{ data: { fill: 'green' } }}
                size={2}
                data={graphData}
              />
              <VictoryLine
                data={graphData}
                interpolation="monotoneX"
                x={'x'}
                y={'y'}
                style={{ data: { stroke: '#c43a31', strokeWidth: 1 } }}
              />
            </VictoryChart>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Timeseries
