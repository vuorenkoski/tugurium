const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { Sequelize, Op, QueryTypes } = require('sequelize')
const { connectToDatabase, sequelizeRaw } = require('./util/db')
const { Sensor, Measurement, User } = require('./models')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { SECRET, SENSOR_TOKEN } = require('./util/config')

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
    createUser(username: String!, password: String!): String
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

const sensorData = async (root, args, context) => {
  if (!context.currentUser) {
    throw new UserInputError('Not authorized', {
      invalidArgs: args.name,
    })
  }

  let period = 1
  if (args.average === 'HOUR') {
    period = 60 * 60
  }
  if (args.average === 'DAY') {
    period = 24 * 60 * 60
  }

  const sensors = await Sensor.findAll({
    where: { sensorName: { [Op.in]: args.sensorName } },
    raw: true,
  })

  let data = []
  for (let i in sensors) {
    let measurements = await sequelizeRaw.query(
      `SELECT AVG(value) as value, timestamp / ${period} as timestamp FROM measurements WHERE sensor_id='${sensors[i].id}' AND timestamp>=${args.minDate} AND timestamp<${args.maxDate} GROUP BY timestamp / ${period}`,
      { nest: true, type: QueryTypes.SELECT }
    )
    measurements = measurements.map((m) => ({
      value: m.value,
      timestamp: m.timestamp * period,
    }))
    data.push({
      sensorFullname: sensors[i].sensorFullname,
      sensorName: sensors[i].sensorName,
      sensorUnit: sensors[i].sensorUnit,
      measurements: measurements,
    })
  }
  return data
}

const sensorToken = async (root, args, context) => {
  if (!context.currentUser) {
    throw new UserInputError('Not authorized', {
      invalidArgs: args.name,
    })
  }

  return { value: SENSOR_TOKEN }
}

const currentSensorData = async (root, args, context) => {
  if (!context.currentUser) {
    throw new UserInputError('Not authorized', {
      invalidArgs: args.name,
    })
  }

  const measurements = await Measurement.findAll({
    attributes: [
      sequelize.literal(
        'DISTINCT ON ("measurement"."sensor_id") "measurement"."sensor_id"'
      ),
      'value',
      'timestamp',
      'id',
    ],
    include: {
      model: Sensor,
      attributes: ['sensorFullname', 'sensorUnit'],
    },
    order: [
      ['sensor_id', 'DESC'],
      ['timestamp', 'DESC'],
    ],
  })
  return measurements
}

const allSensors = async (root, args, context) => {
  if (!context.currentUser) {
    throw new UserInputError('Not authorized', {
      invalidArgs: args.name,
    })
  }

  const sensors = await Sensor.findAll()
  return sensors
}

const deleteSensor = async (root, args, context) => {
  if (!context.currentUser) {
    throw new UserInputError('Not authorized', {
      invalidArgs: args.name,
    })
  }

  await Measurement.destroy({ where: { sensorId: args.id } })
  const sensor = await Sensor.findOne({ where: { id: args.id } })
  await sensor.destroy()
  return sensor
}

const updateSensor = async (root, args, context) => {
  if (!context.currentUser) {
    throw new UserInputError('Not authorized', {
      invalidArgs: args.name,
    })
  }

  const sensor = await Sensor.findOne({ where: { id: args.id } })
  sensor.sensorName = args.sensorName
  sensor.sensorFullname = args.sensorFullname
  sensor.sensorUnit = args.sensorUnit
  await sensor.save()
  return sensor
}

const newSensor = async (root, args, context) => {
  if (!context.currentUser) {
    throw new UserInputError('Not authorized', {
      invalidArgs: args.name,
    })
  }
  const sensors = await Sensor.findAll()
  if (sensors.find((p) => p.sensorName === args.sensorName)) {
    throw new UserInputError('Sensor name must be unique', {
      invalidArgs: args.name,
    })
  }
  const sensor = await Sensor.create({
    sensorName: args.sensorName,
    sensorFullname: args.sensorFullname,
    sensorUnit: args.sensorUnit,
  })
  return sensor
}

const allUsers = async (root, args, context) => {
  if (!context.currentUser) {
    throw new UserInputError('Not authorized', {
      invalidArgs: args.name,
    })
  }

  const users = await User.findAll()
  return users
}

const addMeasurement = async (root, args, context) => {
  if (!context.currentUser) {
    throw new UserInputError('Not authorized', {
      invalidArgs: args.name,
    })
  }
  const sensor = await Sensor.findOne({
    where: { sensorName: args.sensorName },
  })
  const value = parseFloat(args.value)
  if (value) {
    const measurement = await Measurement.create({
      sensorId: sensor.id,
      value,
      timestamp: Math.floor(Date.now() / 1000),
    })
    return measurement
  } else {
    throw new UserInputError('Bad formatted measurement', {
      invalidArgs: args.name,
    })
  }
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

  return { value: token }
}

const createUser = async (root, args) => {
  const { username, password } = args
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await Measurement.create({
    username,
    passwordHash,
  })
  return user
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
    currentSensorData,
    allSensors,
    sensorDetails,
    allUsers,
    sensorToken,
  },
  Mutation: {
    addMeasurement,
    login,
    createUser,
    deleteSensor,
    updateSensor,
    newSensor,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let data = {}
    if (
      req.headers.authorization &&
      req.headers.authorization.toLowerCase().startsWith('bearer ')
    ) {
      data['token'] = req.headers.authorization.substring(7)
      if (data['token'] !== SENSOR_TOKEN) {
        const decodedToken = jwt.verify(data['token'], SECRET)
        data['currentUser'] = await User.findOne({
          where: { id: decodedToken.id },
        })
      }
    }
    return data
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
