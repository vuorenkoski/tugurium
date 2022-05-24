import Text from './Text'
import { FlatList, View, StyleSheet } from 'react-native'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_SENSORS, NEW_MEASUREMENT } from '../graphql/sensor'
import { convertDate, convertTemp } from '../utils/conversions'

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  footer: {
    height: 150,
  },

  flexContainer: {
    display: 'flex',
    backgroundColor: 'white',
  },
  content: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  sensorData: {
    flexDirection: 'column',
    paddingRight: 10,
  },
  sensorName: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 0,
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 0,
  },
  sensorDate: {
    fontSize: 16,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
    padding: 0,
  },
  loading: {
    fontSize: 18,
    color: 'black',
    padding: 20,
    paddingTop: 40,
  },
})

const SensorItem = ({ item }) => {
  return (
    <View style={styles.content}>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.sensorData}>
            <Text style={styles.sensorName}>{item.sensorFullname}</Text>
          </View>

          <View style={styles.sensorData}>
            <Text style={styles.sensorValue}>
              {convertTemp(item.lastValue, item.sensorUnit)}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.sensorData}>
            <Text style={styles.sensorDate}>
              {convertDate(item.lastTimestamp)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const ItemSeparator = () => <View style={styles.separator} />

const ItemListFooter = () => <View style={styles.footer} />

const Current = () => {
  const sensors = useQuery(ALL_SENSORS, {
    fetchPolicy: 'network-only',
    onError: (e) => console.log(e),
  })

  useSubscription(NEW_MEASUREMENT)

  if (sensors.data && sensors.data.allSensors) {
    return (
      <View style={styles.flexContainer}>
        <FlatList
          data={sensors.data.allSensors}
          ItemSeparatorComponent={ItemSeparator}
          ListHeaderComponent={ItemSeparator}
          ListFooterComponent={ItemListFooter}
          renderItem={({ item }) => <SensorItem item={item} />}
        />
      </View>
    )
  }
  return (
    <View style={styles.flexContainer}>
      <Text style={styles.loading}>Ladataan dataa palvelimelta...</Text>
    </View>
  )
}

export default Current
