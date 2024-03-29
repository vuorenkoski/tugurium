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
    lastValue: Float
    lastTimestamp: Int
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
    count: Int
  }

  type Measurement {
    id: ID
    sensor: Sensor!
    value: Float!
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

  type Message {
    id: ID!
    from: String!
    message: String!
    important: Boolean!
    createdAt: String!
  }

  type Token {
    token: String
    user: User
  }

  type Query {
    allMessages: [Message]
    allSensors: [Sensor]
    allImages: [Image]
    allSwitches: [Switch]
    sensorStats: [SensorStat]
    sensorToken: Token
    allUsers: [User]
    sensorDetails(sensorName: String!): Sensor!
    datapoints(sensorName: String): [Datapoints]
    sensorData(
      sensorName: String!
      average: Average
      minDate: Int
      maxDate: Int
    ): Sensor
    currentSensorData: [Measurement]
    getFirstTimestamp: Int!
    getSwitchCommand(name: String!): Boolean
    getUser: User
  }

  type Mutation {
    addMeasurement(sensorName: String!, value: String): Measurement
    deleteMeasurement(id: Int!): Measurement
    login(username: String!, password: String!): Token
    createUser(username: String!, password: String!): User
    deleteUser(id: Int!): User
    changePassword(password: String!): User
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
    setSwitchCommand(id: Int!, command: Boolean): Switch
    setSwitchStatus(name: String!, on: Boolean!): Switch
    addMessage(from: String!, message: String!, important: Boolean!): Message
  }

  type Subscription {
    statusChanged: Switch!
    newMeasurement: Sensor!
    newMessage: Message!
  }
`

module.exports = typeDefs
