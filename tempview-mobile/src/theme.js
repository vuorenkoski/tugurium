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
  },
  fontSizes: {
    body: 14,
    heading1: 24,
    primaryValue: 18,
    secondaryValue: 16,
    heading2: 16,
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
  itemBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 0,
    marginRight: 30,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
}

export default theme
