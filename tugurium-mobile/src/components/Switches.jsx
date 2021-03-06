import { ScrollView, View, StyleSheet, AppState } from 'react-native'
import { useQuery, useSubscription, useMutation } from '@apollo/client'
import SwitchSelector from 'react-native-switch-selector'
import { useRef, useEffect } from 'react'
import {
  ALL_SWITCHES,
  STATUS_CHANGED,
  SET_SWITCH_COMMAND,
} from '../graphql/switch'

import Text from './Text'
import ItemBox from './ItemBox'
import theme from '../theme'
import { convertDate } from '../utils/conversions'
import { NETWORK_ERROR, LOADING } from '../utils/config'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
  switchListStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 80,
  },
  itemBoxStyle: {
    width: 320,
  },
  row: {
    flexDirection: 'row',
  },
  columnCenter: {
    flexDirection: 'column',
    paddingRight: 10,
    justifyContent: 'center',
  },
  itemStatusButton: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 5,
    color: 'white',
    borderRadius: 5,
    textAlign: 'center',
    width: 80,
  },
  selectorStyle: {
    width: 120,
  },
})

const Item = ({ item, admin }) => {
  const [setSwitch] = useMutation(SET_SWITCH_COMMAND, {
    refetchQueries: [{ query: ALL_SWITCHES }],
  })

  const handleClick = async (sw, value) => {
    const variables = {
      command: value,
      setSwitchId: Number(sw.id),
    }
    sw.command = value
    await setSwitch({ variables })
  }

  return (
    <ItemBox>
      <View style={styles.row}>
        <Text textType="primaryText">{item.description}</Text>
      </View>
      <View style={styles.row}>
        <Text textType="secondaryText" style={{ paddingBottom: 10 }}>
          {convertDate(Number(item.updatedAt) / 1000)}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={styles.columnCenter}>
          <Text textType="secondaryText">tila:</Text>
        </View>
        <View style={styles.columnCenter}>
          <Text
            style={{
              ...styles.itemStatusButton,
              backgroundColor: item.on
                ? theme.colors.primary
                : theme.colors.secondary,
            }}
          >
            {item.on ? <>ON</> : <>OFF</>}
          </Text>
        </View>
        <View style={styles.columnCenter}>
          <SwitchSelector
            style={styles.selectorStyle}
            disabled={!admin}
            options={[
              { label: 'OFF', value: false },
              { label: 'ON', value: true },
            ]}
            initial={item.command ? 1 : 0}
            value={item.command ? 1 : 0}
            disableValueChangeOnPress={true}
            onPress={(value) => handleClick(item, value)}
            backgroundColor={theme.colors.secondary}
            buttonColor={admin ? theme.colors.primary : 'grey'}
            fontSize={20}
            textColor={'white'}
          />
        </View>
      </View>
    </ItemBox>
  )
}

const Switches = ({ user }) => {
  const appState = useRef(AppState.currentState)

  const switches = useQuery(ALL_SWITCHES, {
    fetchPolicy: 'network-only',
    onError: (e) => console.log(e),
  })

  useEffect(() => {
    AppState.addEventListener('change', (nextAppState) => {
      if (
        switches &&
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        switches.refetch()
      }
      appState.current = nextAppState
    })
  }, [])

  useSubscription(STATUS_CHANGED, { onError: (e) => console.log(e) })

  return (
    <View>
      <View style={styles.labelRow}>
        <Text textType="heading1">Kytkimet</Text>
      </View>
      {!switches.data && switches.loading && (
        <View style={styles.labelRow}>
          <Text textType="loading">{LOADING}</Text>
        </View>
      )}
      {!switches.data && switches.error && switches.error.networkError && (
        <View style={styles.labelRow}>
          <Text textType="error">{NETWORK_ERROR}</Text>
        </View>
      )}
      {switches.data && (
        <View>
          <ScrollView>
            <View style={styles.switchListStyle}>
              {switches.data.allSwitches.map((item) => (
                <Item key={item.id} item={item} admin={user.admin} />
              ))}
              {(!switches.data || !switches.data.allSwitches) && (
                <View style={styles.column}>
                  <Text textType="loading">{LOADING}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  )
}

export default Switches
