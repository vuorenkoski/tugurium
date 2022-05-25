import Text from './Text'
import { View, StyleSheet } from 'react-native'
import theme from '../theme'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
})

const Images = () => {
  return (
    <View style={theme.content}>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text textType="heading1">Kamerat</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Images
