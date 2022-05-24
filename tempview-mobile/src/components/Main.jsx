import { Route, Routes, Navigate, Link } from 'react-router-native'
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native'

import Login from './Login'
import Settings from './Settings'
import Current from './Current'
import Images from './Images'
import Switches from './Switches'
import Timeseries from './Timeseries'
import theme from '../theme'

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
  loginContainer: {
    backgroundColor: 'white',
    flexGrow: 1,
    flexShrink: 1,
  },
  navContainer: {
    padding: 20,
    paddingTop: Constants.statusBarHeight,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignContent: 'space-around',
  },
  flexItem: {
    padding: 10,
  },
  navText: { color: 'white', fontSize: 20 },
  logoText: {
    color: 'blue',
    fontSize: 44,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 150,
    paddingBottom: 0,
  },
  normalText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: 40,
  },
})

const AppBarTab = (props) => {
  return (
    <View style={styles.flexItem}>
      <Link to={props.page}>
        <Text style={styles.navText}>{props.text}</Text>
      </Link>
    </View>
  )
}

const Main = () => {
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()
  const { user } = useGetUser()

  const logout = () => {
    authStorage.removeAccessToken()
    apolloClient.resetStore()
  }

  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.navContainer}>
          <ScrollView horizontal>
            <AppBarTab text="Lämpötilat" page="/" />
            <AppBarTab text="Aikasarjat" page="/timeseries" />
            <AppBarTab text="Kamerat" page="/images" />
            <AppBarTab text="Kytkimet" page="/switches" />
            <AppBarTab text="Asetukset" page="/settings" />
            <View style={styles.flexItem}>
              <Pressable onPress={logout}>
                <Text style={styles.navText}>Logout</Text>
              </Pressable>
            </View>
          </ScrollView>
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
    )
  }
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.logoText}>TEMPVIEW</Text>
      <Text style={styles.normalText}>versio {VERSION}</Text>
      <Login />
    </View>
  )
}

export default Main
