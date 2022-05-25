import { Text as NativeText, StyleSheet } from 'react-native'

import theme from '../theme'

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal,
  },
  heading1: {
    fontSize: theme.fontSizes.heading1,
    fontWeight: theme.fontWeights.bold,
    paddingBottom: 5,
  },
  heading2: {
    fontSize: theme.fontSizes.heading2,
    fontWeight: theme.fontWeights.bold,
    paddingTop: 15,
    paddingBottom: 5,
  },
  menuItem: {
    fontSize: theme.fontSizes.heading2,
    paddingBottom: 10,
  },
  primaryText: {
    fontSize: theme.fontSizes.primaryValue,
    fontWeight: theme.fontWeights.bold,
  },
  secondaryText: {
    fontSize: theme.fontSizes.secondaryValue,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
  loading: {
    fontSize: theme.fontSizes.primaryValue,
    color: theme.colors.primary,
    padding: 20,
    paddingTop: 40,
  },
})

const Text = ({ textType, color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    textType === 'heading1' && styles.heading1,
    textType === 'heading2' && styles.heading2,
    textType === 'menuItem' && styles.menuItem,
    textType === 'primaryText' && styles.primaryText,
    textType === 'secondaryText' && styles.secondaryText,
    textType === 'loading' && styles.loading,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ]

  return <NativeText style={textStyle} {...props} />
}

export default Text
