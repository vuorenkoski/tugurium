import Text from './Text'
import { View, StyleSheet } from 'react-native'
import PasswordChange from './PasswordChange'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
})

const Settings = ({ user }) => {
  return (
    <View>
      <View style={styles.labelRow}>
        <Text textType="heading1">Asetukset</Text>
      </View>
      <View style={styles.row}>
        <PasswordChange user={user} />
      </View>
    </View>
  )
}

export default Settings
