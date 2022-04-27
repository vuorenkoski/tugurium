import { gql } from '@apollo/client'

export const ALL_SENSORS = gql`
  query AllSensors {
    allSensors {
      sensorName
      sensorFullname
      sensorUnit
    }
  }
`

export const SENSOR_DATA = gql`
  query SensorData($sensorName: String!) {
    sensorData(sensorName: $sensorName) {
      value
      timestamp
    }
  }
`
