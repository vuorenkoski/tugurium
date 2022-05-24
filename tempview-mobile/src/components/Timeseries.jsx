import Text from './Text'
import {
  View,
  StyleSheet,
  Pressable,
  Form,
  CheckBox,
  Select,
} from 'react-native'

import { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'

// import Chart from './Chart'
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

  flexContainer: {
    display: 'flex',
    backgroundColor: 'grey',
  },
  content: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  itemData: {
    flexDirection: 'column',
    paddingRight: 10,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 18,
  },
  itemDate: {
    fontSize: 16,
    paddingBottom: 20,
  },
  itemStatus: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 8,
    color: 'black',
    borderRadius: 5,
    borderColor: 'black',
    textAlign: 'center',
    borderWidth: 2,
    width: 80,
  },
  itemStatusButtonOn: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 10,
    color: 'white',
    borderRadius: 5,
    backgroundColor: 'blue',
    textAlign: 'center',
    width: 80,
  },
  itemStatusButtonOff: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 10,
    color: 'white',
    borderRadius: 5,
    backgroundColor: 'grey',
    textAlign: 'center',
    width: 80,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
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
  const [year, setYear] = useState(null)
  const [zoomDomain, setZoomDomain] = useState({})
  const [data, setData] = useState([])

  useQuery(GET_FIRST_TIMESTAMP, {
    onCompleted: (data) => {
      const series = createYearSeries(data)
      setYears(series)
      setYear(series[0])
    },
  })

  const [getSensorData, { loading }] = useLazyQuery(SENSOR_DATA)

  const sensors = useQuery(ALL_SENSORS)

  const handleSensorChange = (e) => {
    if (e.target.checked) {
      setSelectedSensors(selectedSensors.concat(e.target.id))
      getSensorData({
        variables: {
          sensorName: e.target.id,
          average: period,
          minDate: year.minEpoch,
          maxDate: year.maxEpoch,
        },
        onCompleted: (response) => {
          const processedData = processData(response)
          if (processedData) {
            const newData = data.concat(processedData)
            setData(newData)
            setZoomDomain({
              x: zoomDomain.x,
              y: [
                newData.reduce((p, c) => Math.min(p, c.min), 0),
                newData.reduce((p, c) => Math.max(p, c.max), 0),
              ],
            })
          }
        },
      })
    } else {
      setSelectedSensors(selectedSensors.filter((i) => i !== e.target.id))
      setData(data.filter((d) => d.sensorName !== e.target.id))
    }
  }

  const handlePeriodChange = async (e) => {
    setPeriod(e.target.value)
    const graphData = []
    for (let i in selectedSensors) {
      const sensor = selectedSensors[i]
      const resp = await getSensorData({
        variables: {
          sensorName: sensor,
          average: e.target.value,
          minDate: year.minEpoch,
          maxDate: year.maxEpoch,
        },
      })
      const processedData = processData(resp.data)
      if (processedData) graphData.push(processedData)
    }
    setData(graphData)
    setZoomDomain({})
  }

  const handleYearChange = async (e) => {
    const value = years[Number(e.target.value)]
    setYear(value)
    const graphData = []
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
      if (processedData) graphData.push(processedData)
    }
    setData(graphData)
    setZoomDomain({})
  }

  console.log('years:', years)
  return (
    <View style={styles.content}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text>Aikasarjat</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          {loading && <Text>Ladataan dataa palvelimelta...</Text>}
          {!loading && <Text> &nbsp;</Text>}
        </View>
      </View>
    </View>
  )
}

export default Timeseries
