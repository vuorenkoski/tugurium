import { View, StyleSheet } from 'react-native'

import theme from '../theme'

const styles = StyleSheet.create({
  itemBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.mainBackground,
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 0,
    marginRight: 30,
    borderColor: theme.colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
  },
})

const ItemBox = ({ ...props }) => {
  const textStyle = [styles.itemBox]

  return (
    <View style={textStyle} {...props}>
      {props.children}
    </View>
  )
}

export default ItemBox
