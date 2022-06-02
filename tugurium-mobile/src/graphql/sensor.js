import { gql } from '@apollo/client'

export const ALL_SENSORS = gql`
  query AllSensors {
    allSensors {
      id
      sensorName
      sensorFullname
      sensorUnit
      agrmethod
      lastValue
      lastTimestamp
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
    $agrmethod: String!
  ) {
    updateSensor(
      sensorName: $sensorName
      sensorFullname: $sensorFullname
      sensorUnit: $sensorUnit
      id: $updateSensorId
      agrmethod: $agrmethod
    ) {
      id
      sensorName
      sensorFullname
      sensorUnit
      agrmethod
    }
  }
`

export const NEW_SENSOR = gql`
  mutation NewSensor(
    $sensorName: String!
    $sensorFullname: String!
    $sensorUnit: String!
    $agrmethod: String!
  ) {
    newSensor(
      sensorName: $sensorName
      sensorFullname: $sensorFullname
      sensorUnit: $sensorUnit
      agrmethod: $agrmethod
    ) {
      sensorName
      sensorFullname
      sensorUnit
      agrmethod
    }
  }
`

export const SENSOR_STATS = gql`
  query SensorStats {
    sensorStats {
      sensor {
        sensorFullname
        sensorName
      }
      firstTimestamp
      count
    }
  }
`

export const SENSOR_TOKEN = gql`
  query SensorToken {
    sensorToken {
      token
    }
  }
`

export const NEW_MEASUREMENT = gql`
  subscription {
    newMeasurement {
      id
      sensorName
      sensorFullname
      sensorUnit
      agrmethod
      lastValue
      lastTimestamp
    }
  }
`

export const DATAPOINTS = gql`
  query Datapoints($sensorName: String) {
    datapoints(sensorName: $sensorName) {
      count
      timestamp
    }
  }
`
