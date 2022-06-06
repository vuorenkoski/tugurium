import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
} from 'victory-native'
import { View } from 'react-native'
import { COLORS } from '../utils/config'

const chartStyle = { fontSize: 12, height: 320 }

const Chart = ({ data, yDomain }) => {
  if (data && data.length > 0) {
    return (
      <VictoryChart
        theme={VictoryTheme.material}
        padding={{ top: 60, bottom: 50, left: 30, right: 30 }}
        domain={{
          y: yDomain,
        }}
        scale={{ x: 'time' }}
        height={chartStyle.height}
      >
        <VictoryAxis
          dependentAxis
          crossAxis={false}
          style={{
            tickLabels: { fontSize: 12 },
          }}
        />
        <VictoryAxis
          offsetY={50}
          orientation="bottom"
          tickCount={10}
          fixLabelOverlap={true}
          style={{
            axisLabel: { fontSize: chartStyle.fontSize, padding: 30 },
            tickLabels: { fontSize: chartStyle.fontSize, padding: 0 },
          }}
        />
        <VictoryLegend
          orientation="horizontal"
          itemsPerRow={2}
          x={0}
          y={0}
          style={{
            border: { stroke: 'none' },
            labels: { fontSize: chartStyle.fontSize },
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
    )
  }
  return <View></View>
}

export default Chart
