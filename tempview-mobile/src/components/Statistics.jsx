import Text from './Text'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { convertDateToDate, convertNumber } from '../utils/conversions'
import DropDownSelector from './DropDownSelector'
import Chart from './Chart'
import { SENSOR_STATS, DATAPOINTS } from '../graphql/sensor'

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  description: {
    width: 190,
  },
  count: {
    width: 50,
  },
  date: {
    width: 100,
  },
  optionComponentStyle: {
    flexDirection: 'column',
    margin: 10,
    marginTop: 20,
  },
  graphRow: {
    flexDirection: 'column',
    flex: 1,
  },
})

const noScale = (x) => x

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
      mlist.map((y, i) => ({ value: y, timestamp: (i + min) * secondsInDay }))
    )
  } else {
    setMeasurements([])
  }
}

const SensorItem = ({ item }) => {
  return (
    <View style={styles.row}>
      <Text textType="secodanryText" style={styles.description}>
        {item.sensorFullname}
      </Text>
      <Text textType="secondaryText" style={styles.count}>
        {convertNumber(item.count)}
      </Text>
      <Text textType="secondaryText" style={styles.date}>
        {convertDateToDate(item.firstTimestamp)}
      </Text>
    </View>
  )
}

const Statistics = () => {
  const [selectedSensor, setSelectedSensor] = useState({ sensorName: null })
  const [measurements, setMeasurements] = useState(null)
  const [sensors, setSensors] = useState(null)

  const sensorsData = useQuery(SENSOR_STATS, {
    onCompleted: (data) => {
      setSensors(
        data.sensorStats.map((s) => ({
          sensorFullname: s.sensor.sensorFullname,
          sensorName: s.sensor.sensorName,
          count: s.count,
          firstTimestamp: s.firstTimestamp,
        }))
      )
    },
  })

  useQuery(DATAPOINTS, {
    variables: {
      sensorName: selectedSensor.sensorName,
    },
    onCompleted: (data) => processData(data, setMeasurements),
  })

  const handleSensorChange = (item) => {
    setSelectedSensor(item)
    setMeasurements(null)
  }

  return (
    <ScrollView style={styles.content}>
      <View style={styles.labelRow}>
        <Text textType="heading1">Tilastoja</Text>
      </View>
      {!sensorsData.data && sensorsData.loading && (
        <View style={styles.labelRow}>
          <Text textType="loading">Ladataan dataa palvelimelta...</Text>
        </View>
      )}
      {!sensorsData.data &&
        sensorsData.error &&
        sensorsData.error.networkError && (
          <View style={styles.labelRow}>
            <Text textType="error">
              Virhe: Verkkovirhe (backend ei tavoitettavissa?)
            </Text>
          </View>
        )}
      {sensors && (
        <>
          <View style={styles.sensorListStyle}>
            <View style={styles.row}>
              <Text textType="primaryText" style={styles.description}>
                Sensori
              </Text>
              <Text textType="primaryText" style={styles.count}>
                Lkm
              </Text>
              <Text textType="primaryText" style={styles.date}>
                1. aikaleima
              </Text>
            </View>

            {sensors.map((item) => (
              <SensorItem key={item.sensorName} item={item} />
            ))}

            <View style={styles.row}>
              <Text textType="primaryText" style={styles.description}>
                Yhteensä
              </Text>
              <Text textType="primaryText" style={styles.count}>
                {convertNumber(sensors.reduce((p, c) => p + c.count, 0))}
              </Text>
            </View>
          </View>

          <View style={styles.optionComponentStyle}>
            <Text textType="heading2">
              Sensorin datapisteiden määrät vuorokaudessa
            </Text>
            <DropDownSelector
              selectorType="DropDown"
              data={sensors}
              labelField="sensorFullname"
              valueField="sensorName"
              placeholder="valitse sensori"
              value={selectedSensor.sensorName}
              onChange={(item) => {
                handleSensorChange(item)
              }}
            />
          </View>
          <View style={styles.graphRow}>
            {!measurements && selectedSensor && (
              <Text textType="loading">Ladataan dataa palvelimelta...</Text>
            )}
            {measurements && measurements.length === 0 && (
              <Text>ei datapisteitä</Text>
            )}
            {measurements && measurements.length > 0 && (
              <Chart
                data={[
                  {
                    measurements,
                    scaleFn: noScale,
                    legendLabel: selectedSensor.sensorFullname,
                  },
                ]}
                yDomain={[
                  0,
                  measurements.reduce((p, c) => Math.max(p, c.value), 0),
                ]}
              />
            )}
          </View>
        </>
      )}
    </ScrollView>
  )
}

export default Statistics
