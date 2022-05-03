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
  query SensorData(
    $sensorName: [String]
    $average: Average
    $minDate: Int
    $maxDate: Int
  ) {
    sensorData(
      sensorName: $sensorName
      average: $average
      minDate: $minDate
      maxDate: $maxDate
    ) {
      sensorName
      sensorFullname
      sensorUnit
      measurements {
        value
        timestamp
      }
    }
  }
`
export const CURRENT_SENSOR_DATA = gql`
  query Query {
    currentSensorData {
      timestamp
      value
      sensor {
        sensorFullname
        sensorUnit
      }
    }
  }
`
