import { TextInput as NativeTextInput, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  inputBox: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
})

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [style, styles.inputBox]
  if (error) {
    return (
      <NativeTextInput
        style={[textInputStyle, { borderColor: 'red' }]}
        {...props}
      />
    )
  }
  return <NativeTextInput style={textInputStyle} {...props} />
}

export default TextInput
