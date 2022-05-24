import Text from './Text'
import { FlatList, View, StyleSheet, Pressable } from 'react-native'
import { useQuery, useSubscription, useMutation } from '@apollo/client'
import {
  ALL_SWITCHES,
  STATUS_CHANGED,
  SET_SWITCH_COMMAND,
} from '../graphql/queries'
import { convertDate } from '../utils/conversions'

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
    padding: 0,
  },
})

const Item = ({ item }) => {
  const [setSwitch] = useMutation(SET_SWITCH_COMMAND, {
    refetchQueries: [{ query: ALL_SWITCHES }],
  })

  const handleClick = async (sw) => {
    const variables = {
      command: !sw.command,
      setSwitchId: Number(sw.id),
    }
    await setSwitch({ variables })
  }

  return (
    <View testID="repositoryItem" style={styles.content}>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.itemData}>
            <Text style={styles.itemName}>{item.description}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.itemData}>
            <Text style={styles.itemDate}>
              {convertDate(Number(item.updatedAt) / 1000)}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.itemData}>
            <Text style={styles.itemText}>tila:</Text>
          </View>
          <View style={styles.itemData}>
            <Text style={styles.itemStatus}>
              {item.on ? <>ON</> : <>OFF</>}
            </Text>
          </View>

          <View style={styles.itemData}>
            <Text style={styles.itemText}>käsky:</Text>
          </View>
          <View style={styles.itemData}>
            <Pressable onPress={() => handleClick(item)}>
              <Text
                style={
                  item.command
                    ? styles.itemStatusButtonOn
                    : styles.itemStatusButtonOff
                }
              >
                {item.command ? <>ON </> : <>OFF</>}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

const ItemSeparator = () => <View style={styles.separator} />

const ItemListFooter = () => <View style={styles.footer} />

const Switches = () => {
  const switches = useQuery(ALL_SWITCHES, {
    fetchPolicy: 'network-only',
    onError: (e) => console.log(e),
  })

  useSubscription(STATUS_CHANGED)

  if (switches.data && switches.data.allSwitches) {
    return (
      <View style={styles.flexContainer}>
        <FlatList
          data={switches.data.allSwitches}
          ItemSeparatorComponent={ItemSeparator}
          ListHeaderComponent={ItemSeparator}
          ListFooterComponent={ItemListFooter}
          renderItem={({ item }) => <Item item={item} />}
        />
      </View>
    )
  }
  return (
    <View style={styles.flexContainer}>
      <Text>ladataan...</Text>
    </View>
  )
}

export default Switches
