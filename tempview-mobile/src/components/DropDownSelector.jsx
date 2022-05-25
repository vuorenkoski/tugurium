import { View, StyleSheet } from 'react-native'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'
import Text from './Text'
import theme from '../theme'
import { useRef } from 'react'

const styles = StyleSheet.create({
  separator: {
    height: 5,
  },
  selectorStyle: {
    width: 250,
    borderColor: theme.colors.secondary,
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 15,
  },
  selectorContainerStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.6,
    shadowRadius: 1.41,
    elevation: 20,
    margin: 20,
    marginTop: -60,
    width: 200,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.secondary,
  },
  itemRow: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemStyle: {
    fontSize: theme.fontSizes.body,
    padding: 3,
  },
})

const renderItem = (item, labelField) => {
  return (
    <View style={styles.itemRow}>
      <Text style={styles.itemStyle}>{item[labelField]}</Text>
    </View>
  )
}

const ItemSeparator = () => <View style={styles.separator} />

const DropDownSelector = ({ selectorType, labelField, onChange, ...props }) => {
  const selectorRef = useRef()

  const onChangeWithClose = (item) => {
    selectorRef.current.close()
    onChange(item)
  }

  if (selectorType === 'DropDown') {
    return (
      <Dropdown
        {...props}
        labelField={labelField}
        onChange={onChange}
        style={styles.selectorStyle}
        selectedTextStyle={{ fontSize: theme.fontSizes.body }}
        containerStyle={styles.selectorContainerStyle}
        textError="Error"
        activeColor={theme.colors.secondary}
        renderItem={(item) => renderItem(item, labelField)}
        autoScroll={false}
        flatListProps={{
          ItemSeparatorComponent: ItemSeparator,
        }}
      />
    )
  }
  if (selectorType === 'MultiSelect') {
    return (
      <MultiSelect
        {...props}
        ref={selectorRef}
        labelField={labelField}
        onChange={onChangeWithClose}
        style={styles.selectorStyle}
        selectedTextStyle={{ fontSize: theme.fontSizes.body }}
        containerStyle={styles.selectorContainerStyle}
        textError="Error"
        activeColor={theme.colors.secondary}
        renderItem={(item) => renderItem(item, labelField)}
        autoScroll={false}
        flatListProps={{
          ItemSeparatorComponent: ItemSeparator,
        }}
        renderSelectedItem={() => null}
        dropdownPosition={'bottom'}
      />
    )
  }
  return null
}

export default DropDownSelector
