import { Platform } from 'react-native'

const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    mainBackground: 'white',
    primary: '#0366d6',
    secondary: 'silver',
    delete: 'red',
    update: 'green',
    error: 'red',
  },
  fontSizes: {
    body: 16,
    heading1: 24,
    heading2: 18,
    primary: 16,
    secondary: 16,
  },
  fonts: {
    main: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System',
    }),
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
  content: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 0,
    marginRight: 0,
  },
}

export default theme
