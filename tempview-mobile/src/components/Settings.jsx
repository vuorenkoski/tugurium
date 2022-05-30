import Text from './Text'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
})

const Settings = () => {
  return (
    <View style={styles.labelRow}>
      <Text textType="heading1">Asetukset</Text>
    </View>
  )
}

export default Settings
