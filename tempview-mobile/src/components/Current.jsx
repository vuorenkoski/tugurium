import Text from './Text'
import { FlatList, View, StyleSheet } from 'react-native'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_SENSORS, NEW_MEASUREMENT } from '../graphql/sensor'
import { convertDate, convertTemp } from '../utils/conversions'
import theme from '../theme'
import ItemBox from './ItemBox'

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  footer: {
    height: 250,
  },
  flexContainer: {
    display: 'flex',
    backgroundColor: 'white',
  },
  columnWithPadding: {
    flexDirection: 'column',
    paddingRight: 10,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
})

const SensorItem = ({ item }) => {
  return (
    <ItemBox>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.columnWithPadding}>
            <Text textType="primaryText">{item.sensorFullname}</Text>
          </View>

          <View style={styles.column}>
            <Text textType="primaryText">
              {convertTemp(item.lastValue, item.sensorUnit)}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="secondaryText">
              {convertDate(item.lastTimestamp)}
            </Text>
          </View>
        </View>
      </View>
    </ItemBox>
  )
}

const ItemSeparator = () => <View style={styles.separator} />

const ItemListFooter = () => <View style={styles.footer} />

const Current = () => {
  const sensors = useQuery(ALL_SENSORS, {
    fetchPolicy: 'network-only',
    onError: (e) => console.log(e),
  })

  useSubscription(NEW_MEASUREMENT, { onError: (e) => console.log(e) })

  return (
    <View style={theme.content}>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading1">Lämpötilat</Text>
          </View>
        </View>
        <View style={styles.row}>
          {sensors.data && sensors.data.allSensors && (
            <View style={styles.flexContainer}>
              <FlatList
                data={sensors.data.allSensors}
                ItemSeparatorComponent={ItemSeparator}
                ListHeaderComponent={ItemSeparator}
                ListFooterComponent={ItemListFooter}
                renderItem={({ item }) => <SensorItem item={item} />}
              />
            </View>
          )}
          {(!sensors.data || !sensors.data.allSensors) && (
            <View style={styles.column}>
              <Text textType="loading">Ladataan dataa palvelimelta...</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default Current
