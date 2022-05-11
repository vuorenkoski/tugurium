const { gql } = require('apollo-server')

const typeDefs = gql`
  enum Average {
    NO
    HOUR
    DAY
  }

  type Sensor {
    id: ID!
    sensorName: String!
    sensorFullname: String!
    sensorUnit: String!
    measurements: [Measurement]
  }

  type Measurement {
    id: ID!
    sensor: Sensor!
    value: String!
    timestamp: Int!
  }

  type User {
    id: ID!
    username: String!
    admin: Boolean!
  }

  type Query {
    allSensors: [Sensor]
    sensorToken: Token
    allUsers: [User]
    sensorDetails(sensorName: String!): Sensor!
    sensorData(
      sensorName: [String]
      average: Average
      minDate: Int
      maxDate: Int
    ): [Sensor]
    currentSensorData: [Measurement]
  }

  type Token {
    value: String!
  }

  type Mutation {
    addMeasurement(sensorName: String!, value: String): Measurement
    login(username: String!, password: String!): Token
    createUser(username: String!, password: String!): User
    deleteUser(id: Int!): User
    deleteSensor(id: Int!): Sensor
    updateSensor(
      sensorName: String!
      sensorFullname: String!
      sensorUnit: String!
      id: Int!
    ): Sensor
    newSensor(
      sensorName: String!
      sensorFullname: String!
      sensorUnit: String!
    ): Sensor
  }
`

module.exports = typeDefs
