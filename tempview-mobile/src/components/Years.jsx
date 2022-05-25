import Text from './Text'
import { View, StyleSheet } from 'react-native'
import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'

import { ALL_SENSORS } from '../graphql/sensor'
import { GET_FIRST_TIMESTAMP, SENSOR_DATA } from '../graphql/measurement'
import Chart from './Chart'
import theme from '../theme'

const styles = StyleSheet.create({
  separator: {
    height: 5,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  selectorStyle: {
    width: 250,
    borderColor: theme.colors.secondary,
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 15,
  },
  selectorContainerStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.6,
    shadowRadius: 1.41,
    elevation: 20,
    margin: 20,
    marginTop: -60,
    width: 200,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.secondary,
  },
  itemRow: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemStyle: {
    fontSize: theme.fontSizes.body,
    padding: 3,
  },
  graphView: {
    paddingTop: 20,
  },
})

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

const monthlyDataFromDaily = (dailyData) => {
  const currentMonthYear = new Date().getMonth() + new Date().getFullYear() * 12
  let newData = []
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
          const value = sum[i] / count[i]
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
    newData.push({
      legendLabel: d.legendLabel,
      measurements: result,
      scaleFn: noScale,
    })
  })
  return { min, max, graphData: newData }
}

const groupByYear = (measurements, firstTimestamp) => {
  let newData = null
  let min = 0
  let max = 10
  let sum = {}
  let count = {}

  // Create series for every year
  const years = createYearSeries(firstTimestamp)
  newData = years.map((y) => ({
    legendLabel: y,
    measurements: [],
    scaleFn: noScale,
  }))
  for (let i = 0; i < measurements.length; i++) {
    const date = new Date(measurements[i].timestamp * 1000)
    const year = date.getFullYear()
    date.setFullYear(currentYear)
    const value = measurements[i].value

    newData[year - parseInt(years[0])].measurements.push({
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
      newData[avgIndex].measurements.push({
        value: sum[key] / count[key],
        timestamp: Number(key) + yearToEpoch(currentYear),
      })
    }
  }
  // include only years with data
  newData = newData.filter((d) => d.measurements.length > 0)
  return { min, max, graphData: newData }
}

const processData = (sensorData, setData, firstTimestamp) => {
  if (sensorData) {
    const daily = groupByYear(sensorData.measurements, firstTimestamp)
    const monthly = monthlyDataFromDaily(daily)
    const unit = sensorData.sensorUnit
    const result = { monthly, daily, unit }
    setData(result)
  }
}

const Years = () => {
  const [selectedSensor, setSelectedSensor] = useState()
  const [selectedYears, setSelectedYears] = useState([])
  const [graphData, setGraphData] = useState(null)
  const [period, setPeriod] = useState('daily')
  const yearSelectorRef = useRef()

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
        setGraphData,
        firstTimestamp.data.getFirstTimestamp
      )
    }
  }, [firstTimestamp, sensorData])

  const handleSensorChange = (item) => {
    setSelectedSensor(item.sensorName)
    setGraphData(null)
  }

  const handleYearChange = (item) => {
    yearSelectorRef.current.close()
    setSelectedYears(item)
  }

  const handlePeriodChange = (item) => {
    setPeriod(item.value)
  }

  const renderItem = (item) => {
    return (
      <View style={styles.itemRow}>
        <Text style={styles.itemStyle}>{item.label}</Text>
      </View>
    )
  }

  const renderSensorItem = (item) => {
    return (
      <View style={styles.itemRow}>
        <Text style={styles.itemStyle}>{item.sensorFullname}</Text>
      </View>
    )
  }

  const ItemSeparator = () => <View style={styles.separator} />

  console.log(selectedYears)
  return (
    <View style={theme.content}>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading1">Vuosivertailu</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading2">Datapisteiden yhdistäminen</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Dropdown
              style={styles.selectorStyle}
              selectedTextStyle={{ fontSize: theme.fontSizes.body }}
              containerStyle={styles.selectorContainerStyle}
              data={[
                { label: 'vuorokausi', value: 'daily' },
                { label: 'kuukausi', value: 'monthly' },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              value={period}
              onChange={(item) => {
                handlePeriodChange(item)
              }}
              textError="Error"
              activeColor={theme.colors.secondary}
              renderItem={(item) => renderItem(item)}
              flatListProps={{
                ItemSeparatorComponent: ItemSeparator,
              }}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading2">Sensori</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Dropdown
              style={styles.selectorStyle}
              selectedTextStyle={{ fontSize: theme.fontSizes.body }}
              containerStyle={styles.selectorContainerStyle}
              data={sensors.data.allSensors}
              labelField="sensorFullname"
              valueField="sensorName"
              placeholder="valitse sensori"
              value={selectedSensor}
              onChange={(item) => {
                handleSensorChange(item)
              }}
              textError="Error"
              activeColor={theme.colors.secondary}
              renderItem={(item) => renderSensorItem(item)}
              autoScroll={false}
              flatListProps={{
                ItemSeparatorComponent: ItemSeparator,
              }}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading2">Vuodet</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            {graphData && (
              <MultiSelect
                ref={yearSelectorRef}
                style={styles.selectorStyle}
                selectedTextStyle={{ fontSize: theme.fontSizes.body }}
                containerStyle={styles.selectorContainerStyle}
                data={graphData.daily.graphData
                  .map((d) => ({
                    label: d.legendLabel,
                  }))
                  .reverse()}
                labelField="label"
                valueField="label"
                placeholder="valitse vuosi"
                value={selectedYears}
                onChange={handleYearChange.bind(this)}
                renderItem={(item) => renderItem(item)}
                maxSelect={4}
                maxHeight={250}
                activeColor={theme.colors.secondary}
                renderSelectedItem={() => null}
                dropdownPosition={'bottom'}
                flatListProps={{
                  ItemSeparatorComponent: ItemSeparator,
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.graphView}>
          <View style={styles.column}>
            {!sensorData.data && selectedSensor && (
              <Text textType="loading">Ladataan dataa palvelimelta...</Text>
            )}
            {graphData && graphData[period] && selectedYears.length > 0 && (
              <Chart
                data={graphData[period].graphData.filter((d) =>
                  selectedYears.includes(d.legendLabel)
                )}
                yDomain={[graphData[period].min, graphData[period].max]}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Years
