import Text from './Text'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_SENSORS, NEW_MEASUREMENT } from '../graphql/sensor'
import { convertDate, convertTemp } from '../utils/conversions'
import ItemBox from './ItemBox'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
  senorsStyle: {},
  senorListStyle: {
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
  const sensors = useQuery(ALL_SENSORS, {
    fetchPolicy: 'network-only',
    onError: (e) => console.log(e),
  })

  useSubscription(NEW_MEASUREMENT, { onError: (e) => console.log(e) })

  return (
    <View>
      <ScrollView style={styles.senorStyle}>
        <View style={styles.labelRow}>
          <Text textType="heading1">Viimeisimmät lämpötilat</Text>
        </View>
        {!sensors.data && sensors.loading && (
          <View style={styles.row}>
            <Text textType="loading">Ladataan dataa palvelimelta...</Text>
          </View>
        )}
        {!sensors.data && sensors.error && sensors.error.networkError && (
          <View style={styles.row}>
            <Text textType="error">
              Virhe: Verkkovirhe (backend ei tavoitettavissa?)
            </Text>
          </View>
        )}
        <View style={styles.senorListStyle}>
          {sensors.data &&
            sensors.data.allSensors &&
            sensors.data.allSensors.map((item) => (
              <SensorItem key={item.id} item={item} />
            ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default Current
