import { gql } from '@apollo/client'

export const ALL_SENSORS = gql`
  query AllSensors {
    allSensors {
      id
      sensorName
      sensorFullname
      sensorUnit
    }
  }
`

export const ALL_USERS = gql`
  query AllUsers {
    allUsers {
      id
      username
      admin
    }
  }
`

export const SENSOR_TOKEN = gql`
  query SensorToken {
    sensorToken {
      value
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

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
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
