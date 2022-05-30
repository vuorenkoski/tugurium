import Text from './Text'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
})

const Statistics = () => {
  return (
    <View style={styles.labelRow}>
      <Text textType="heading1">Tilastoja</Text>
    </View>
  )
}

export default Statistics
