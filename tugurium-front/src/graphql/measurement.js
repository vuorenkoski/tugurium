import { gql } from '@apollo/client'

export const GET_FIRST_TIMESTAMP = gql`
  query Query {
    getFirstTimestamp
  }
`

export const SENSOR_DATA = gql`
  query SensorData(
    $sensorName: String!
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
      agrmethod
      measurements {
        value
        timestamp
      }
    }
  }
`
export const ADD_MEASUREMENT = gql`
  mutation Mutation($sensorName: String!, $value: String) {
    addMeasurement(sensorName: $sensorName, value: $value) {
      value
      timestamp
    }
  }
`
