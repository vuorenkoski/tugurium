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
    paddingBottom: 25,
  },
  heading2: {
    fontSize: theme.fontSizes.heading2,
    fontWeight: theme.fontWeights.bold,
    paddingTop: 0,
    paddingBottom: 5,
  },
  menuItem: {
    fontSize: theme.fontSizes.heading2,
    paddingBottom: 10,
  },
  primaryText: {
    fontSize: theme.fontSizes.primary,
    fontWeight: theme.fontWeights.bold,
  },
  secondaryText: {
    fontSize: theme.fontSizes.secondary,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  error: {
    fontSize: theme.fontSizes.primary,
    color: theme.colors.error,
    padding: 10,
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
    fontSize: theme.fontSizes.primary,
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
    textType === 'error' && styles.error,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ]

  return <NativeText style={textStyle} {...props} />
}

export default Text
