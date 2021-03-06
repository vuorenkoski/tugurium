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
    paddingBottom: 10,
  },
  passwordChange: {
    flexDirection: 'row',
  },
})

const Settings = ({ user }) => {
  const [backendVersion, setBackendVersion] = useState('')
  const [hostname, setHostname] = useState('')
  const authStorage = useAuthStorage()

  useEffect(() => {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        setBackendVersion(this.responseText)
      }
    }
    authStorage.getHost().then((host) => {
      setHostname(host)
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
      <View style={styles.passwordChange}>
        <Text textType="heading2">Versiot</Text>
      </View>
      <View style={styles.row}>
        <Text>Frontend: Tugurium {VERSION}</Text>
      </View>
      <View style={styles.row}>
        <Text>
          Backend: {backendVersion} ({hostname})
        </Text>
      </View>
    </View>
  )
}

export default Settings
