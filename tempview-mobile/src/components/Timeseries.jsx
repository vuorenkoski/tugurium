import React from 'react'

import Text from './Text'
import { View, StyleSheet } from 'react-native'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'

import { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'

import Chart from './Chart'
import { ALL_SENSORS } from '../graphql/sensor'
import { GET_FIRST_TIMESTAMP, SENSOR_DATA } from '../graphql/measurement'

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

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  footer: {
    height: 150,
  },
  title1: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingBottom: 5,
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },

  flexContainer: {
    display: 'flex',
    backgroundColor: 'grey',
  },
  content: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 0,
    marginRight: 0,
  },
  itemData: {
    flexDirection: 'column',
    paddingRight: 10,
    justifyContent: 'center',
  },
  itemDate: {
    fontSize: 16,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  selectorStyle: {
    width: 280,
  },
  dropdown: {
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginTop: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemRow: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  selectedStyle: {
    backfaceVisibility: 'hidden',
    fontSize: 8,
    backgroundColor: 'white',
  },
  selectedTextStyle: {
    fontSize: 8,
    color: 'black',
  },
  loading: {
    fontSize: 18,
    color: 'black',
    padding: 20,
    paddingTop: 40,
  },
  graphView: {
    paddingTop: 20,
  },
})

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
  })

  const [getSensorData, { loading }] = useLazyQuery(SENSOR_DATA)

  const sensors = useQuery(ALL_SENSORS)

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

  const renderSensorItem = (item) => {
    return (
      <View style={styles.itemRow}>
        <Text style={styles.itemText}>{item.sensorFullname}</Text>
      </View>
    )
  }

  const renderYearItem = (item) => {
    return (
      <View style={styles.itemRow}>
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
    )
  }

  return (
    <View style={styles.content}>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.title1}>Aikasarjat</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.title2}>Datapisteiden yhdistäminen</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Dropdown
              style={styles.selectorStyle}
              containerStyle={styles.shadow}
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
              textError="Error"
              renderItem={(item) => renderYearItem(item)}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.title2}>Ajanjakso</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Dropdown
              style={styles.selectorStyle}
              containerStyle={styles.shadow}
              data={years}
              labelField="label"
              valueField="label"
              placeholder="Select item"
              value={year.label}
              onChange={(item) => {
                handleYearChange(item)
              }}
              textError="Error"
              renderItem={(item) => renderYearItem(item)}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.title2}>Sensorit</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            {sensors.data && (
              <MultiSelect
                id={'sensorSelector'}
                style={styles.selectorStyle}
                data={sensors.data.allSensors}
                labelField="sensorFullname"
                valueField="sensorName"
                placeholder="valitse sensorit"
                value={selectedSensors}
                onChange={(item) => {
                  handleSensorChange(item)
                }}
                renderItem={(item) => renderSensorItem(item)}
                selectedStyle={styles.selectedStyle}
                selectedTextStyle={styles.selectedTextStyle}
                maxSelect={4}
                maxHeight={250}
                activeColor={'silver'}
                renderSelectedItem={() => null}
              />
            )}
          </View>
        </View>

        <View style={styles.graphView}>
          <View style={styles.column}>
            {loading && (
              <Text style={styles.loading}>Ladataan dataa palvelimelta...</Text>
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
