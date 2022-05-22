import {
  VictoryChart,
  VictoryLine,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
  createContainer,
} from 'victory'
import { Row, Col } from 'react-bootstrap'

import { convertDate } from '../util/conversions'
const { COLORS } = require('../util/config')
const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi')

const Chart = ({ data, zoomDomain, setZoomDomain, yDomain }) => {
  const handleZoom = (domain) => {
    setZoomDomain(domain)
  }

  return (
    <div>
      <Row className="p-4 pt-0 border rounded m-3">
        {data && data.length > 0 && (
          <div>
            <Col className="col-auto ">
              <VictoryChart
                theme={VictoryTheme.material}
                width={1200}
                height={500}
                domain={{
                  y: yDomain,
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
                    tickLabels: { fontSize: 20 },
                  }}
                />
                <VictoryAxis
                  offsetY={50}
                  orientation="bottom"
                  tickCount={10}
                  fixLabelOverlap={true}
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
                  y: yDomain,
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
                {data.map((d, i) => (
                  <VictoryLine
                    key={i}
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

export default Chart
