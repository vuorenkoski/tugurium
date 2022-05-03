const { ApolloServer, gql } = require('apollo-server')
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
  type Query {
    allSensors: [Sensor!]!
    sensorDetails(sensorName: String!): Sensor!
    sensorData(
      sensorName: [String]
      average: Average
      minDate: Int
      maxDate: Int
    ): [Sensor]
    currentSensorData: [Measurement]
  }
  type Mutation {
    addMeasurement(sensorName: String!, value: String): Measurement
    login(username: String!, password: String!): String
  }
`

const sensorData = async (root, args) => {
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

  // const data = await Sensor.findAll({
  //   include: {
  //     model: Measurement,
  //     attributes: {
  //       include: [
  //         [
  //           sequelize.literal(sequelize.col('timestamp').col + '/' + period),
  //           'timestamp',
  //         ],
  //         [
  //           sequelize.fn('MIN', sequelize.col('measurements.id')),
  //           'measurements.id',
  //         ],
  //       ],
  //     },
  //   },
  //   attributes: {
  //     include: [
  //       [
  //         sequelize.fn('AVG', sequelize.col('measurements.value')),
  //         'measurements.value',
  //       ],
  //       [
  //         sequelize.fn('MIN', sequelize.col('measurements.id')),
  //         'measurements.id',
  //       ],
  //     ],
  //     exclude: ['id'],
  //   },
  //   where: { sensorName: { [Op.in]: args.sensorName } },
  //   group: [
  //     'sensor.id',
  //     sequelize.literal(sequelize.col('timestamp').col + '/' + period),
  //   ],
  // })
  return data
}

const currentSensorData = async () => {
  console.log('asdasd')
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
  if (value) {
    const measurement = await Measurement.create({
      sensorId: sensor.id,
      value,
      timestamp: Math.floor(Date.now() / 1000),
    })
    return measurement
  }
  return
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
    currentSensorData,
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
