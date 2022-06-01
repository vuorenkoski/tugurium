import Text from './Text'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
})

const Images = () => {
  return (
    <View style={styles.labelRow}>
      <Text textType="heading1">Kamerat</Text>
    </View>
  )
}

export default Images
