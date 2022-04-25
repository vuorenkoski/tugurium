const { ApolloServer, gql } = require('apollo-server')

const sensors = [
  {
    sensorName: 'CINS',
    sensorFullname: 'Mökin sisälämpötila',
    ID: '1',
  },
  {
    sensorName: 'COUT',
    sensorFullname: 'Mökin ulkolämpötila',
    ID: '2',
  },
  {
    sensorName: 'CLAK',
    sensorFullname: 'Mökin järven lämpötila',
    ID: '3',
  },
]

let measurementData = []

const typeDefs = gql`
  type Sensor {
    id: ID!
    sensorName: String!
    sensorFullname: String!
  }
  type Measurement {
    id: ID!
    sensor: Sensor!
    reading: String!
    timestamp: Int!
  }
  type Query {
    allSensors: [Sensor!]!
    sensorDetails(sensorName: String!): Sensor!
    sensorData(sensorName: String!): [Measurement!]!
  }
  type Mutation {
    addMeasurement(sensorName: String!, reading: String): Measurement
  }
`

const sensorData = (root, args) => {
  const measurements = measurementData.filter(
    (m) => m.sensorName === args.sensorName
  )
  console.log(measurements)
  return measurements
}

const resolvers = {
  Query: {
    sensorData: sensorData,
    allSensors: () => sensors,
    sensorDetails: (root, args) =>
      sensors.find((s) => s.sensorName === args.sensorName),
  },
  Measurement: {
    sensor: ({ sensorName }) => {
      return {
        sensorName,
      }
    },
  },
  Mutation: {
    addMeasurement: (root, args) => {
      const measurement = { ...args, timestamp: Math.floor(Date.now() / 1000) }
      measurementData = measurementData.concat(measurement)
      return measurement
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
