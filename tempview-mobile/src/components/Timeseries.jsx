import { View, StyleSheet } from 'react-native'
import { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'

import Text from './Text'
import theme from '../theme'
import Chart from './Chart'
import { ALL_SENSORS } from '../graphql/sensor'
import { GET_FIRST_TIMESTAMP, SENSOR_DATA } from '../graphql/measurement'
import DropDownSelector from './DropDownSelector'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  graphView: {
    paddingTop: 20,
  },
})

const createYearSeries = (data) => {
  const yearSeries = []
  const currentEpoch = Math.floor(new Date().valueOf() / 1000)
  yearSeries.push({
    label: 'Viimeinen viikko',
    minEpoch: currentEpoch - 60 * 60 * 24 * 7,
    maxEpoch: currentEpoch,
  })
  yearSeries.push({
    label: 'viimeiset 2kk',
    minEpoch: currentEpoch - 60 * 60 * 24 * 30 * 2,
    maxEpoch: currentEpoch,
  })
  yearSeries.push({
    label: 'viimeiset 6kk',
    minEpoch: currentEpoch - 60 * 60 * 24 * 30 * 6,
    maxEpoch: currentEpoch,
  })
  let y = new Date().getFullYear()
  const firstYear = new Date(data.getFirstTimestamp * 1000).getFullYear()
  while (y >= firstYear) {
    yearSeries.push({
      label: y.toString(),
      minEpoch: yearToEpoch(y),
      maxEpoch: yearToEpoch(y + 1),
    })
    y--
  }
  return yearSeries
}

const yearToEpoch = (year) => {
  const date = new Date(year, 0, 1)
  return Math.floor(date.valueOf() / 1000)
}

const scaleUp = (x) => x * 10
const scaleDown = (x) => x / 10
const noScale = (x) => x

const processData = (data) => {
  if (data.sensorData && data.sensorData.measurements.length > 1) {
    let scaleTxt = ''
    let scaleFn = noScale
    const min = data.sensorData.measurements.reduce(
      (p, c) => Math.min(p, c.value),
      0
    )
    const max = data.sensorData.measurements.reduce(
      (p, c) => Math.max(p, c.value),
      0
    )
    if (max > 70) {
      scaleFn = scaleDown
      scaleTxt = ' /10'
    }
    if (max < 4 && max > 0) {
      scaleFn = scaleUp
      scaleTxt = ' x10'
    }
    const resp = {
      legendLabel: `${data.sensorData.sensorFullname} (${data.sensorData.sensorUnit}${scaleTxt})`,
      sensorName: data.sensorData.sensorName,
      min,
      max: scaleFn(max),
      scaleFn,
      measurements: data.sensorData.measurements,
    }
    return resp
  }
  return null
}

const Timeseries = () => {
  const [selectedSensors, setSelectedSensors] = useState([])
  const [years, setYears] = useState([])
  const [period, setPeriod] = useState('HOUR')
  const [year, setYear] = useState({ label: null })
  const [graphData, setGraphData] = useState([])

  useQuery(GET_FIRST_TIMESTAMP, {
    onCompleted: (data) => {
      const series = createYearSeries(data)
      setYears(series)
      setYear(series[0])
    },
    onError: (e) => console.log(e),
  })

  const [getSensorData, { loading }] = useLazyQuery(SENSOR_DATA, {
    onError: (e) => console.log(e),
  })

  const sensors = useQuery(ALL_SENSORS, { onError: (e) => console.log(e) })

  const handleSensorChange = async (value) => {
    setSelectedSensors(value)
    const newData = []

    for (let i = 0; i < value.length; i++) {
      const resp = await getSensorData({
        variables: {
          sensorName: value[i],
          average: period,
          minDate: year.minEpoch,
          maxDate: year.maxEpoch,
        },
      })
      const processedData = processData(resp.data)
      if (processedData) {
        newData.push(processedData)
      }
    }
    setGraphData(newData)
  }

  const handlePeriodChange = async (item) => {
    const value = item.value
    setPeriod(value)
    const newData = []
    for (let i in selectedSensors) {
      const sensor = selectedSensors[i]
      const resp = await getSensorData({
        variables: {
          sensorName: sensor,
          average: value,
          minDate: year.minEpoch,
          maxDate: year.maxEpoch,
        },
      })
      const processedData = processData(resp.data)
      if (processedData) newData.push(processedData)
    }
    setGraphData(newData)
  }

  const handleYearChange = async (item) => {
    const value = item
    setYear(value)
    const newData = []
    for (let i in selectedSensors) {
      const sensor = selectedSensors[i]
      const resp = await getSensorData({
        variables: {
          sensorName: sensor,
          average: period,
          minDate: value.minEpoch,
          maxDate: value.maxEpoch,
        },
      })
      const processedData = processData(resp.data)
      if (processedData) newData.push(processedData)
    }
    setGraphData(newData)
  }

  return (
    <View style={theme.content}>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading1">Aikasarjat</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading2">Datapisteiden yhdistäminen</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <DropDownSelector
              selectorType="DropDown"
              data={[
                { label: 'ei yhdistämistä', value: 'NO' },
                { label: 'tunti', value: 'HOUR' },
                { label: 'vuorokausi', value: 'DAY' },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              value={period}
              onChange={(item) => {
                handlePeriodChange(item)
              }}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading2">Ajanjakso</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <DropDownSelector
              selectorType="DropDown"
              data={years}
              labelField="label"
              valueField="label"
              placeholder="valitse"
              value={year.label}
              onChange={(item) => {
                handleYearChange(item)
              }}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading2">Sensorit</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            {sensors.data && (
              <DropDownSelector
                selectorType="MultiSelect"
                data={sensors.data.allSensors}
                labelField="sensorFullname"
                valueField="sensorName"
                placeholder="valitse sensorit"
                value={selectedSensors}
                onChange={(item) => {
                  handleSensorChange(item)
                }}
                maxSelect={4}
                maxHeight={250}
              />
            )}
          </View>
        </View>

        <View style={styles.graphView}>
          <View style={styles.column}>
            {loading && (
              <Text textType="loading">Ladataan dataa palvelimelta...</Text>
            )}
            {!loading && (
              <Chart
                data={graphData}
                yDomain={[
                  graphData.reduce((p, c) => Math.min(p, c.min), 0),
                  graphData.reduce((p, c) => Math.max(p, c.max), 0),
                ]}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Timeseries
