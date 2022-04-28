const { ApolloServer, gql } = require('apollo-server')
const { Sequelize, Op } = require('sequelize')
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
    measurements: [Measurement]
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
    sensorData(sensorName: [String]): [Sensor]
  }
  type Mutation {
    addMeasurement(sensorName: String!, value: String): Measurement
    login(username: String!, password: String!): String
  }
`

const sensorData = async (root, args) => {
  const measurements = await Sensor.findAll({
    include: {
      model: Measurement,
      attributes: ['value', 'timestamp'],
    },
    where: { sensorName: { [Op.in]: args.sensorName } },
  })
  console.log(JSON.stringify(measurements))
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
  Mutation: {
    addMeasurement,
    login,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
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
