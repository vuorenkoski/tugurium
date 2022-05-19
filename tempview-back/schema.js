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
    agrmethod: String!
    measurements: [Measurement]
  }

  type Image {
    id: ID!
    name: String!
    description: String
    updatedAt: String
  }

  type Switch {
    id: ID!
    name: String!
    description: String
    on: Boolean
    command: Boolean
    commandFile: String
    updatedAt: String
  }

  type SensorStat {
    sensor: Sensor!
    firstTimestamp: String
    count: Int!
  }

  type Measurement {
    id: ID!
    sensor: Sensor!
    value: String!
    timestamp: Int!
  }

  type Datapoints {
    count: Int!
    timestamp: Int!
  }

  type User {
    id: ID!
    username: String!
    admin: Boolean!
  }

  type Query {
    allSensors: [Sensor]
    allImages: [Image]
    allSwitches: [Switch]
    sensorStats: [SensorStat]
    sensorToken: Token
    allUsers: [User]
    sensorDetails(sensorName: String!): Sensor!
    datapoints(sensorName: String): [Datapoints]
    sensorData(
      sensorName: [String]
      average: Average
      minDate: Int
      maxDate: Int
    ): [Sensor]
    currentSensorData: [Measurement]
    getFirstTimestamp: Int!
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
      agrmethod: String!
      id: Int!
    ): Sensor
    newSensor(
      sensorName: String!
      sensorFullname: String!
      sensorUnit: String!
      agrmethod: String!
    ): Sensor
    newImage(name: String!, description: String): Image
    updateImage(name: String!, description: String, id: Int!): Image
    deleteImage(id: Int!): Image
    newSwitch(name: String!, description: String, commandFile: String): Switch
    updateSwitch(
      name: String!
      description: String
      commandFile: String
      id: Int!
    ): Switch
    deleteSwitch(id: Int!): Switch
    setSwitch(id: Int!, on: Boolean): Switch
    setSwitchCommand(id: Int!, command: Boolean): Switch
    setSwitchStatus(name: String!, on: Boolean!): Switch
  }

  type Subscription {
    statusChanged: Switch!
  }
`

module.exports = typeDefs
