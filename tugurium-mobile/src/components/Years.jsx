import Text from './Text'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_SENSORS } from '../graphql/sensor'
import { GET_FIRST_TIMESTAMP, SENSOR_DATA } from '../graphql/measurement'
import Chart from './Chart'
import DropDownSelector from './DropDownSelector'

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
  },
  optionListRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionComponentStyle: {
    flexDirection: 'column',
    margin: 10,
    marginTop: 0,
  },
  graphRow: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
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

  const firstTimestamp = useQuery(GET_FIRST_TIMESTAMP)

  const sensorData = useQuery(SENSOR_DATA, {
    variables: {
      sensorName: selectedSensor,
      average: 'DAY',
    },
  })

  const sensors = useQuery(ALL_SENSORS, {
    fetchPolicy: 'network-only',
    onError: (e) => console.log(e),
  })

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

  return (
    <ScrollView style={styles.content}>
      <View style={styles.labelRow}>
        <Text textType="heading1">Vuosivertailu</Text>
      </View>
      {!sensors.data && sensors.loading && (
        <View style={styles.labelRow}>
          <Text textType="loading">Ladataan dataa palvelimelta...</Text>
        </View>
      )}
      {!sensors.data && sensors.error && sensors.error.networkError && (
        <View style={styles.labelRow}>
          <Text textType="error">
            Verkkovirhe (backend ei tavoitettavissa?)
          </Text>
        </View>
      )}
      {sensors.data && (
        <View>
          <View style={styles.optionListRow}>
            <View style={styles.optionComponentStyle}>
              <Text textType="heading2">Datapisteiden yhdistäminen</Text>
              <DropDownSelector
                selectorType="DropDown"
                data={[
                  { label: 'vuorokausi', value: 'daily' },
                  { label: 'kuukausi', value: 'monthly' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="valitse"
                value={period}
                onChange={(item) => {
                  setPeriod(item.value)
                }}
              />
            </View>
            <View style={styles.optionComponentStyle}>
              <Text textType="heading2">Sensori</Text>
              <DropDownSelector
                selectorType="DropDown"
                data={sensors.data.allSensors}
                labelField="sensorFullname"
                valueField="sensorName"
                placeholder="valitse sensori"
                value={selectedSensor}
                onChange={(item) => {
                  handleSensorChange(item)
                }}
              />
              {graphData && graphData.unit && (
                <Text>Mittayksikkö: {graphData.unit} </Text>
              )}
            </View>
            <View style={styles.optionComponentStyle}>
              <Text textType="heading2">Vuodet</Text>
              {graphData && (
                <DropDownSelector
                  selectorType="MultiSelect"
                  data={graphData.daily.graphData
                    .map((d) => ({
                      label: d.legendLabel,
                    }))
                    .reverse()}
                  labelField="label"
                  valueField="label"
                  placeholder="valitse vuosi"
                  value={selectedYears}
                  onChange={(item) => {
                    setSelectedYears(item)
                  }}
                  maxSelect={4}
                  maxHeight={250}
                />
              )}
              {!graphData && (
                <DropDownSelector
                  selectorType="MultiSelect"
                  disable={true}
                  placeholder=""
                />
              )}
            </View>
          </View>

          <View style={styles.graphRow}>
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
      )}
    </ScrollView>
  )
}

export default Years
