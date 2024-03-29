import { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-native'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
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
import NewMeasurement from './NewMeasurement'
import Statistics from './Statistics'
import Years from './Years'
import Current from './Current'
import Images from './Images'
import Switches from './Switches'
import Settings from './Settings'
import Timeseries from './Timeseries'
import MessagesView from './MessagesView'
import theme from '../theme'
import Text from './Text'

import useAuthStorage from '../hooks/useAuthStorage'
import { useApolloClient } from '@apollo/client'
import { VERSION } from '../utils/config'

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  navContainer: {
    padding: 10,
    paddingBottom: 0,
    paddingTop: 30,
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'space-between',
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.mainBackground,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 0,
    marginRight: 0,
  },
  footerContainer: {
    padding: 0,
  },
  logoNav: {
    color: theme.colors.mainBackground,
    fontSize: 20,
    paddingTop: 18,
    paddingLeft: 40,
    fontWeight: 'bold',
  },
  logoText: {
    color: theme.colors.primary,
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 70,
    paddingBottom: 0,
  },
  versioText: {
    textAlign: 'center',
    paddingBottom: 30,
  },
  optionsWrapper: {
    paddingLeft: 20,
    borderWidth: 2,
    padding: 10,
    borderColor: theme.colors.secondary,
  },
})

const MenuItem = ({ navigate, page, text }) => {
  return (
    <MenuOption onSelect={() => navigate(page, { exact: true })}>
      <Text textType="menuItem">{text}</Text>
    </MenuOption>
  )
}

const MenuElement = ({ logout, admin }) => {
  const navigate = useNavigate()

  return (
    <>
      <Menu>
        <MenuTrigger>
          <Icon reverse color="black" name="menu" />
        </MenuTrigger>

        <MenuOptions
          customStyles={{
            optionsWrapper: styles.optionsWrapper,
          }}
        >
          <MenuItem text="Sensorit" page="/" navigate={navigate} />
          <MenuItem text="Aikasarjat" page="/timeseries" navigate={navigate} />
          <MenuItem text="Vuosivertailu" page="/years" navigate={navigate} />
          <MenuItem text="Kamerat" page="/images" navigate={navigate} />
          <MenuItem text="Kytkimet" page="/switches" navigate={navigate} />
          <MenuItem text="Viestit" page="/messages" navigate={navigate} />
          <MenuItem text="Tilastoja" page="/statistics" navigate={navigate} />
          {admin && (
            <MenuItem
              text="Uusi mittaus"
              page="/newMeasurement"
              navigate={navigate}
            />
          )}
          <MenuItem text="Asetukset" page="/settings" navigate={navigate} />
          <MenuOption onSelect={logout}>
            <Text textType="menuItem">Kirjaudu ulos</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </>
  )
}

const Main = () => {
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()

  const [user, setUser] = useState(null)
  const [storageChecked, setStorageChecked] = useState(false)

  useEffect(() => {
    const user = authStorage.getUser()
    setUser(user)
    setStorageChecked(true)
  }, [])

  const logout = async () => {
    await authStorage.removeAccessToken()
    await authStorage.removeUser()
    await apolloClient.clearStore()
    setUser(null)
  }

  if (!storageChecked) {
    return <View></View>
  }

  if (user) {
    return (
      <MenuProvider>
        <StatusBar style="light" />
        <SafeAreaView style={styles.rootContainer}>
          <View style={styles.navContainer}>
            <Text style={styles.logoNav}>TUGURIUM</Text>
            <MenuElement logout={logout} admin={user.admin} />
          </View>
          <View style={styles.bodyContainer}>
            <Routes>
              <Route path="/" element={<Current />} exact />
              <Route path="/statistics" element={<Statistics />} exact />
              <Route
                path="/newMeasurement"
                element={<NewMeasurement />}
                exact
              />
              <Route path="/images" element={<Images />} exact />
              <Route
                path="/settings"
                element={<Settings user={user} />}
                exact
              />
              <Route path="/years" element={<Years />} exact />
              <Route
                path="/switches"
                element={<Switches user={user} />}
                exact
              />
              <Route path="/messages" element={<MessagesView />} exact />
              <Route path="/timeseries" element={<Timeseries />} exact />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </View>
          <View style={styles.footerContainer}></View>
        </SafeAreaView>
      </MenuProvider>
    )
  }
  return (
    <View>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.logoText}>TUGURIUM</Text>
        <Text style={styles.versioText}>versio {VERSION}</Text>
        <Login setUser={setUser} />
      </View>
    </View>
  )
}

export default Main
