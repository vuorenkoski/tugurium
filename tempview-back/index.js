const { ApolloServer, gql } = require('apollo-server')
const { Sequelize } = require('sequelize')
const { connectToDatabase } = require('./util/db')
const { Sensor, Measurement } = require('./models')

const typeDefs = gql`
  type Sensor {
    id: ID!
    sensorName: String!
    sensorFullname: String!
    sensorUnit: String!
  }
  type Measurement {
    id: ID!
    sensor: Sensor!
    value: String!
    timestamp: Int!
  }
  type Query {
    allSensors: [Sensor!]!
    sensorDetails(sensorName: String!): Sensor!
    sensorData(sensorName: String!): [Measurement!]!
  }
  type Mutation {
    addMeasurement(sensorName: String!, value: String): Measurement
  }
`

const sensorData = async (root, args) => {
  const sensor = await Sensor.findOne({
    where: { sensorName: args.sensorName },
  })
  const measurements = await Measurement.findAll({
    where: { sensorId: sensor.id },
  })
  return measurements
}

const allSensors = async () => {
  const sensors = await Sensor.findAll()
  return sensors
}

const addMeasurement = async (root, args) => {
  const sensor = await Sensor.findOne({
    where: { sensorName: args.sensorName },
  })
  const value = parseFloat(args.value)
  const measurement = await Measurement.create({
    sensorId: sensor.id,
    value,
    timestamp: Math.floor(Date.now() / 1000),
  })
  return measurement
}

const sensorDetails = async (root, args) => {
  const sensor = await Sensor.findOne({
    where: { sensorName: args.sensorName },
  })
  return sensor
}

const resolvers = {
  Query: {
    sensorData,
    allSensors,
    sensorDetails,
  },
  Measurement: {
    sensor: ({ sensorName }) => {
      return {
        sensorName,
      }
    },
  },
  Mutation: {
    addMeasurement,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const main = async () => {
  try {
    await connectToDatabase()
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
  main()
})
