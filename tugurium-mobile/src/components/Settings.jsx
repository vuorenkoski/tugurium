import { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import PasswordChange from './PasswordChange'
import Text from './Text'
import { VERSION } from '../utils/config'
import useAuthStorage from '../hooks/useAuthStorage'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
})

const Settings = ({ user }) => {
  const [backendVersion, setBackendVersion] = useState('')
  const authStorage = useAuthStorage()

  useEffect(() => {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        setBackendVersion(this.responseText)
      }
    }
    authStorage.getHost().then((host) => {
      xhttp.open('GET', `https://${host}/api/version`, true)
      xhttp.send()
    })
  }, [])

  return (
    <View>
      <View style={styles.labelRow}>
        <Text textType="heading1">Asetukset</Text>
      </View>
      <View style={styles.row}>
        <PasswordChange user={user} />
      </View>
      <View style={styles.labelRow}>
        <Text textType="heading2">Versiot</Text>
      </View>
      <View style={styles.labelRow}>
        <Text>Frontend: Tugurium {VERSION}</Text>
      </View>
      <View style={styles.labelRow}>
        <Text>Backend: {backendVersion}</Text>
      </View>
    </View>
  )
}

export default Settings
