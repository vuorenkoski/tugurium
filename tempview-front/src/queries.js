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

export const DELETE_SENSOR = gql`
  mutation Mutation($deleteSensorId: Int!) {
    deleteSensor(id: $deleteSensorId) {
      sensorName
    }
  }
`
export const UPDATE_SENSOR = gql`
  mutation UpdateSensor(
    $sensorName: String!
    $sensorFullname: String!
    $sensorUnit: String!
    $updateSensorId: Int!
  ) {
    updateSensor(
      sensorName: $sensorName
      sensorFullname: $sensorFullname
      sensorUnit: $sensorUnit
      id: $updateSensorId
    ) {
      id
      sensorName
      sensorFullname
      sensorUnit
    }
  }
`

export const NEW_SENSOR = gql`
  mutation NewSensor(
    $sensorName: String!
    $sensorFullname: String!
    $sensorUnit: String!
  ) {
    newSensor(
      sensorName: $sensorName
      sensorFullname: $sensorFullname
      sensorUnit: $sensorUnit
    ) {
      sensorName
      sensorFullname
      sensorUnit
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
