import { useRef, useEffect } from 'react'

import Text from './Text'
import { View, StyleSheet, ScrollView, AppState, Pressable } from 'react-native'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_SENSORS, NEW_MEASUREMENT } from '../graphql/sensor'
import { convertDate, convertTemp } from '../utils/conversions'
import ItemBox from './ItemBox'
import { NETWORK_ERROR, LOADING } from '../utils/config'
import { useNavigate } from 'react-router-native'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
  sensorListStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemBoxStyle: {
    width: 320,
  },
  row: {
    flexDirection: 'row',
  },
})

const onPressSensor = ({ sensorName, nav }) => {
  nav('/timeseries', { exact: true, state: { sensorName } })
}

const SensorItem = ({ item }) => {
  return (
    <ItemBox style={styles.itemBoxStyle}>
      <View style={styles.row}>
        <Text textType="primaryText" style={{ paddingRight: 10 }}>
          {item.sensorFullname}
        </Text>
        <Text textType="primaryText">
          {convertTemp(item.lastValue, item.sensorUnit)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text textType="secondaryText">{convertDate(item.lastTimestamp)}</Text>
      </View>
    </ItemBox>
  )
}

const Current = () => {
  const navigate = useNavigate()
  const appState = useRef(AppState.currentState)
  const sensors = useQuery(ALL_SENSORS, {
    fetchPolicy: 'network-only',
    onError: (e) => console.log(e),
  })

  useEffect(() => {
    AppState.addEventListener('change', (nextAppState) => {
      if (
        sensors &&
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        sensors.refetch()
      }
      appState.current = nextAppState
    })
  }, [])

  useSubscription(NEW_MEASUREMENT, { onError: (e) => console.log(e) })

  return (
    <ScrollView>
      <View style={styles.labelRow}>
        <Text textType="heading1">Viimeisimmät mittaukset</Text>
      </View>
      {!sensors.data && sensors.loading && (
        <View style={styles.row}>
          <Text textType="loading">{LOADING}</Text>
        </View>
      )}
      {!sensors.data && sensors.error && sensors.error.networkError && (
        <View style={styles.row}>
          <Text textType="error">{NETWORK_ERROR}</Text>
        </View>
      )}
      <View style={styles.sensorListStyle}>
        {sensors.data &&
          sensors.data.allSensors &&
          sensors.data.allSensors.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                onPressSensor({ sensorName: item.sensorName, nav: navigate })
              }
            >
              <SensorItem item={item} />
            </Pressable>
          ))}
      </View>
    </ScrollView>
  )
}

export default Current
