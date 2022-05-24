import { gql } from '@apollo/client'

export const DATAPOINTS = gql`
  query Datapoints($sensorName: String) {
    datapoints(sensorName: $sensorName) {
      count
      timestamp
    }
  }
`

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
      measurements {
        value
        timestamp
      }
    }
  }
`
