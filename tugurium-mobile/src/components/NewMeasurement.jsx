import { View, StyleSheet, Pressable, TextInput } from 'react-native'
import Text from './Text'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_SENSORS } from '../graphql/sensor'
import { ADD_MEASUREMENT } from '../graphql/measurement'
import { NETWORK_ERROR, LOADING } from '../utils/config'
import { useState } from 'react'
import { convertDate } from '../utils/conversions'
import DropDownSelector from './DropDownSelector'
import theme from '../theme'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  textInput: {
    width: 250,
    borderColor: theme.colors.secondary,
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonStyle: {
    color: 'white',
    backgroundColor: '#0d6efd',
    borderRadius: 5,
    padding: 10,
    width: 100,
    textAlign: 'center',
  },
})

const NewMeasurement = () => {
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [measurement, setMeasurement] = useState('')
  const [message, setMessage] = useState('')

  const displayMessage = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 4000)
  }

  const [addMeasurement] = useMutation(ADD_MEASUREMENT, {
    onError: (error) => displayMessage(error.message),
    onCompleted: (data) => {
      console.log(data.addMeasurement)
      setMeasurement('')
      displayMessage(
        `Mitaus lisätty (${convertDate(data.addMeasurement.timestamp)}): ${
          data.addMeasurement.value
        }`
      )
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    },
  })

  const sensors = useQuery(ALL_SENSORS, {
    fetchPolicy: 'network-only',
  })

  const add = () => {
    if (!selectedSensor) {
      displayMessage('Valitse sensori!')
      return
    }
    if (!measurement) {
      displayMessage('Syötä lukema!')
      return
    }
    if (isNaN(Number(measurement))) {
      displayMessage('Lukeman tulee olla numero')
      return
    }
    const variables = { sensorName: selectedSensor, value: measurement }
    addMeasurement({ variables })
  }

  return (
    <View>
      <View style={styles.labelRow}>
        <Text textType="heading1">Lisää uusi mittauspiste</Text>
      </View>
      {!sensors.data && sensors.loading && (
        <View style={styles.row}>
          <Text textType="loading">{LOADING}</Text>
        </View>
      )}
      {!sensors.data && sensors.error && sensors.error.networkError && (
        <View style={styles.row}>
          <Text textType="error">{NETWORK_ERROR}</Text>
        </View>
      )}
      {sensors.data && (
        <>
          <DropDownSelector
            selectorType="DropDown"
            data={sensors.data.allSensors}
            labelField="sensorFullname"
            valueField="sensorName"
            placeholder="valitse sensori"
            value={selectedSensor}
            onChange={(item) => {
              setSelectedSensor(item.sensorName)
            }}
          />
          <TextInput
            style={styles.textInput}
            placeholder="mittaus"
            value={measurement}
            onChangeText={(text) => {
              setMeasurement(text)
            }}
          />
          <Pressable onPress={add}>
            <Text fontWeight="bold" style={styles.buttonStyle}>
              Lisää
            </Text>
          </Pressable>
          <View style={styles.row}>
            <Text textType="error">{message}</Text>
          </View>
        </>
      )}
    </View>
  )
}

export default NewMeasurement
