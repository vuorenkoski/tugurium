import { Route, Routes, Navigate } from 'react-router-native'
import { View, StyleSheet } from 'react-native'
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import { useNavigate } from 'react-router-native'

import { Icon } from 'react-native-elements'

import Login from './Login'
import Settings from './Settings'
import Current from './Current'
import Images from './Images'
import Switches from './Switches'
import Timeseries from './Timeseries'
import theme from '../theme'
import Text from './Text'

import Constants from 'expo-constants'

import useAuthStorage from '../hooks/useAuthStorage'
import { useApolloClient } from '@apollo/client'
import useGetUser from '../hooks/useGetUser'
import { VERSION } from '../utils/config'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    flexGrow: 1,
    flexShrink: 1,
  },
  navContainer: {
    padding: 10,
    paddingBottom: 0,
    paddingTop: Constants.statusBarHeight,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignContent: 'space-around',
  },
  logo: {
    color: theme.colors.mainBackground,
    fontSize: 20,
    paddingTop: 18,
    fontWeight: 'bold',
  },
  logoText: {
    color: theme.colors.primary,
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 150,
    paddingBottom: 0,
  },
  versioText: {
    textAlign: 'center',
    paddingBottom: 40,
  },
})

const menuStyle = {
  color: 'black',
  fontSize: 20,
  fontWeight: 'bold',
  padding: 10,
}

const MenuItem = ({ navigate, page, text }) => {
  return (
    <MenuOption onSelect={() => navigate(page, { exact: true })}>
      <Text style={menuStyle}>{text}</Text>
    </MenuOption>
  )
}

const MenuElement = () => {
  const navigate = useNavigate()
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()

  const logout = () => {
    authStorage.removeAccessToken()
    apolloClient.resetStore()
  }

  return (
    <View>
      <Menu>
        <MenuTrigger>
          <Icon reverse color="black" name="menu" />
        </MenuTrigger>

        <MenuOptions>
          <MenuItem text="Lämpötilat" page="/" navigate={navigate} />
          <MenuItem text="Aikasarjat" page="/timeseries" navigate={navigate} />
          <MenuItem text="Kamerat" page="/images" navigate={navigate} />
          <MenuItem text="Kytkimet" page="/switches" navigate={navigate} />
          <MenuItem text="Asetukset" page="/settings" navigate={navigate} />
          <MenuOption onSelect={logout}>
            <Text style={menuStyle}>Logout</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  )
}

const Main = () => {
  const { user } = useGetUser()

  if (user) {
    return (
      <MenuProvider>
        <View style={styles.container}>
          <View style={styles.navContainer}>
            <MenuElement />
            <Text style={styles.logo}>TEMPVIEW</Text>
          </View>
          <Routes>
            <Route path="/" element={<Current />} exact />
            <Route path="/settings" element={<Settings />} exact />
            <Route path="/images" element={<Images />} exact />
            <Route path="/switches" element={<Switches />} exact />
            <Route path="/timeseries" element={<Timeseries />} exact />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </View>
      </MenuProvider>
    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>TEMPVIEW</Text>
      <Text style={styles.versioText}>versio {VERSION}</Text>
      <Login />
    </View>
  )
}

export default Main
