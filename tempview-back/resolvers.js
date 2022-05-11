const { UserInputError, AuthenticationError } = require('apollo-server')
const { Op, QueryTypes } = require('sequelize')
const { sequelizeRaw } = require('./util/db')
const { Sensor, Measurement, User } = require('./models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { SECRET, SENSOR_TOKEN } = require('./util/config')

const sensorData = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
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
    throw new AuthenticationError('Not authorized')
  }

  return { value: SENSOR_TOKEN }
}

const currentSensorData = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }
  const measurements = await sequelizeRaw.query(
    'SELECT a.sensor_id AS "sensor.id", a.value, a.timestamp, sensors.sensor_name AS "sensor.sensorName", sensors.sensor_fullname AS "sensor.sensorFullname", sensors.sensor_unit AS "sensor.sensorUnit" FROM measurements AS a INNER JOIN (SELECT sensor_id, MAX(timestamp) AS timestamp FROM measurements GROUP BY sensor_id) AS b ON a.sensor_id = b.sensor_id AND a.timestamp = b.timestamp INNER JOIN sensors ON sensors.id = a.sensor_id',
    {
      type: QueryTypes.SELECT,
      nest: true,
    }
  )
  return measurements
}

const allSensors = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  const sensors = await Sensor.findAll()
  return sensors
}

const deleteSensor = async (root, args, context) => {
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  await Measurement.destroy({ where: { sensorId: args.id } })
  const sensor = await Sensor.findOne({ where: { id: args.id } })
  await sensor.destroy()
  return sensor
}

const updateSensor = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
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
    throw new AuthenticationError('Not authorized')
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
    throw new AuthenticationError('Not authorized')
  }

  const users = await User.findAll()
  return users
}

const addMeasurement = async (root, args, context) => {
  if (context.token !== SENSOR_TOKEN) {
    throw new AuthenticationError('Not authorized')
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
    throw new UserInputError('Invalid username/password', {
      invalidArgs: args.name,
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }
  const token = jwt.sign(userForToken, SECRET)

  return { value: token }
}

const createUser = async (root, args, context) => {
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  const users = await User.findAll()
  if (users.find((p) => p.username === args.username)) {
    throw new UserInputError('username name must be unique', {
      invalidArgs: args.name,
    })
  }

  const { username, password } = args
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    username,
    passwordHash,
  })
  return user
}

const deleteUser = async (root, args, context) => {
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  const user = await User.findOne({ where: { id: args.id } })
  if (user.admin) {
    throw new UserInputError('Can not delete admin', {
      invalidArgs: args.name,
    })
  }

  await user.destroy()
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
    deleteUser,
    deleteSensor,
    updateSensor,
    newSensor,
  },
}

module.exports = resolvers
