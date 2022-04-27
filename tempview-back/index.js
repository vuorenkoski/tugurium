const { ApolloServer, gql } = require('apollo-server')
const { Sequelize } = require('sequelize')
const { connectToDatabase } = require('./util/db')
const { Sensor, Measurement, User } = require('./models')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { SECRET, SENSOR_TOKEN } = require('./util/config')

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
    login(username: String!, password: String!): String
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

const addMeasurement = async (root, args, token) => {
  if (token.token !== SENSOR_TOKEN) {
    return
  }
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

const login = async (root, args) => {
  const { username, password } = args
  const user = await User.findOne({ where: { username } })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    return 'error'
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }
  const token = jwt.sign(userForToken, SECRET)

  return token
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
    login,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Note: This example uses the `req` argument to access headers,
    // but the arguments received by `context` vary by integration.
    // This means they vary for Express, Koa, Lambda, etc.
    //
    // To find out the correct arguments for a specific integration,
    // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

    // Get the user token from the headers.
    let token = ''
    if (
      req.headers.authorization &&
      req.headers.authorization.toLowerCase().startsWith('bearer ')
    ) {
      token = req.headers.authorization.substring(7)
    }
    return { token }
  },
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
