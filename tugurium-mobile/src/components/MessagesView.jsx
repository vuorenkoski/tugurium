import Text from './Text'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_MESSAGES, NEW_MESSAGE } from '../graphql/message'
import { convertDate } from '../utils/conversions'
import { NETWORK_ERROR, LOADING } from '../utils/config'

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
    width: 100,
  },
  message: {
    width: 350,
    paddingBottom: 15,
  },
  date: {
    width: 100,
  },
  col: {
    flexDirection: 'column',
  },
})

const MessageItem = ({ item }) => {
  return (
    <View style={styles.col}>
      <View style={styles.row}>
        <Text textType="secondaryText" style={styles.description}>
          {item.from}
        </Text>
        <Text textType="secondaryText" style={styles.date}>
          {convertDate(item.createdAt / 1000)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text
          textType={item.important ? 'primaryText' : 'secondaryText'}
          style={styles.message}
        >
          {item.message}
        </Text>
      </View>
    </View>
  )
}

const MessagesView = () => {
  const { subscribeToMore, ...messages } = useQuery(ALL_MESSAGES, {
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    subscribeToMore({
      document: NEW_MESSAGE,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        return Object.assign({}, prev, {
          allMessages: [subscriptionData.data.newMessage, ...prev.allMessages],
        })
      },
    })
  }, [])

  return (
    <ScrollView>
      <View style={styles.labelRow}>
        <Text textType="heading1">Viestit</Text>
      </View>
      {!messages.data && messages.loading && (
        <View style={styles.row}>
          <Text textType="loading">{LOADING}</Text>
        </View>
      )}
      {!messages.data && messages.error && messages.error.networkError && (
        <View style={styles.row}>
          <Text textType="error">{NETWORK_ERROR}</Text>
        </View>
      )}
      <View style={styles.sensorListStyle}>
        {messages.data &&
          messages.data.allMessages &&
          messages.data.allMessages.map((item) => (
            <MessageItem key={item.id} item={item} />
          ))}
      </View>
    </ScrollView>
  )
}

export default MessagesView
