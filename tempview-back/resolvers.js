const { UserInputError, AuthenticationError } = require('apollo-server')
const { QueryTypes } = require('sequelize')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const { sequelize } = require('./util/db')
const { Sensor, Measurement, User, Image, Switch } = require('./models')
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

  const sensor = await Sensor.findOne({
    where: { sensorName: args.sensorName },
    raw: true,
  })

  let minReq = ''
  let maxReq = ''
  if (args.minDate) {
    minReq = `AND timestamp>=${args.minDate} `
  }
  if (args.maxDate) {
    maxReq = `AND timestamp<${args.maxDate} `
  }

  let measurements = await sequelize.query(
    `SELECT ${sensor.agrmethod}(value) as value, timestamp / ${period} as timestamp 
       FROM measurements WHERE sensor_id='${sensor.id}' ${minReq}${maxReq}GROUP BY timestamp / ${period}`,
    { nest: true, type: QueryTypes.SELECT }
  )
  measurements = measurements.map((m) => ({
    value: m.value,
    timestamp: m.timestamp * period,
  }))
  const data = {
    sensorFullname: sensor.sensorFullname,
    sensorName: sensor.sensorName,
    sensorUnit: sensor.sensorUnit,
    agrmethod: sensor.agrmethod,
    measurements: measurements,
  }
  return data
}

const currentSensorData = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }
  // Previous version, nut much slower
  //
  // const measurements = await sequelize.query(
  //   `SELECT a.sensor_id AS "sensor.id", a.value, a.timestamp, sensors.sensor_name AS "sensor.sensorName",
  //        sensors.sensor_fullname AS "sensor.sensorFullname", sensors.sensor_unit AS "sensor.sensorUnit" FROM measurements AS a
  //    INNER JOIN (SELECT sensor_id, MAX(timestamp) AS timestamp FROM measurements
  //    GROUP BY sensor_id) AS b ON a.sensor_id = b.sensor_id AND a.timestamp = b.timestamp
  //    INNER JOIN sensors ON sensors.id = a.sensor_id
  //    ORDER BY sensors.sensor_name`,
  //   {
  //     type: QueryTypes.SELECT,
  //     nest: true,
  //   }

  const measurements = await sequelize.query(
    `SELECT sensor.id AS "sensor.id", measurement.value AS value, measurement.timestamp AS timestamp, sensor.sensor_name AS "sensor.sensorName", 
        sensor.sensor_fullname AS "sensor.sensorFullname", sensor.sensor_unit AS "sensor.sensorUnit" FROM sensors AS sensor INNER JOIN (
      SELECT a.sensor_id AS sensor_id, a.timestamp AS timestamp, a.value AS value FROM measurements AS a INNER JOIN (
       SELECT sensor_id, MAX(timestamp) AS timestamp FROM measurements GROUP BY sensor_id
      ) AS b ON a.sensor_id = b.sensor_id AND a.timestamp = b.timestamp
     ) AS measurement ON sensor.id = measurement.sensor_id ORDER BY sensor.sensor_name`,
    {
      type: QueryTypes.SELECT,
      nest: true,
    }
  )
  console.log(measurements)
  return measurements
}

const datapoints = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  const period = 24 * 60 * 60
  const sensor = await Sensor.findOne({
    where: { sensorName: args.sensorName },
    raw: true,
  })
  let datapoints = await sequelize.query(
    `SELECT COUNT(value) AS count, timestamp / ${period} as timestamp FROM measurements AS measurement 
    WHERE sensor_id=${sensor.id} GROUP BY timestamp / ${period}`,
    {
      type: QueryTypes.SELECT,
      nest: true,
    }
  )
  datapoints = datapoints.map((m) => ({
    count: m.count,
    timestamp: m.timestamp * period,
  }))
  return datapoints
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

const getFirstTimestamp = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }
  const timestamp = await sequelize.query(
    'SELECT MIN(timestamp) AS timestamp FROM measurements',
    {
      type: QueryTypes.SELECT,
      nest: true,
    }
  )
  if (timestamp.length === 0) {
    return 0
  }
  return timestamp[0].timestamp
}

// Sensors
const allSensors = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  const sensors = await Sensor.findAll({ order: [['sensorName', 'ASC']] })
  return sensors
}

const sensorStats = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  const sensors = await sequelize.query(
    `SELECT count, "firstTimestamp", sensor.id as "sensor.id", sensor.sensor_name AS "sensor.sensorName", sensor.sensor_fullname AS "sensor.sensorFullname"
    FROM (SELECT COUNT(value) AS count, MIN(timestamp) AS "firstTimestamp", sensor_id FROM measurements  
    GROUP BY sensor_id) AS measurement INNER JOIN sensors AS sensor ON sensor.id=measurement.sensor_id`,
    {
      type: QueryTypes.SELECT,
      nest: true,
    }
  )

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
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  const sensor = await Sensor.findOne({ where: { id: args.id } })
  sensor.sensorName = args.sensorName
  sensor.sensorFullname = args.sensorFullname
  sensor.sensorUnit = args.sensorUnit
  sensor.agrmethod = args.agrmethod
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
    agrmethod: args.agrmethod,
  })
  return sensor
}

const sensorDetails = async (root, args) => {
  const sensor = await Sensor.findOne({
    where: { sensorName: args.sensorName },
  })
  return sensor
}

const sensorToken = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  return { value: SENSOR_TOKEN }
}

// Users
const allUsers = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  const users = await User.findAll()
  return users
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

// Images
const allImages = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  const images = await Image.findAll({ order: [['name', 'ASC']] })
  return images
}

const deleteImage = async (root, args, context) => {
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  const image = await Image.findOne({ where: { id: args.id } })
  await image.destroy()
  return image
}

const updateImage = async (root, args, context) => {
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  const image = await Image.findOne({ where: { id: args.id } })
  image.name = args.name
  image.description = args.description
  await image.save()
  return image
}

const newImage = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }
  const images = await Image.findAll()
  if (images.find((p) => p.name === args.name)) {
    throw new UserInputError('Image name must be unique', {
      invalidArgs: args.name,
    })
  }
  const image = await Image.create({
    name: args.name,
    description: args.description,
  })
  return image
}

// Switches
const allSwitches = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  const switches = await Switch.findAll({ order: [['name', 'ASC']] })
  return switches
}

const deleteSwitch = async (root, args, context) => {
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  const sw = await Switch.findOne({ where: { id: args.id } })
  await sw.destroy()
  return sw
}

const updateSwitch = async (root, args, context) => {
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  const sw = await Switch.findOne({ where: { id: args.id } })
  sw.name = args.name
  sw.description = args.description
  sw.commandFile = args.commandFile
  await sw.save()
  return sw
}

const newSwitch = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }
  const switches = await Switch.findAll()
  if (switches.find((p) => p.name === args.name)) {
    throw new UserInputError('Switch name must be unique', {
      invalidArgs: args.name,
    })
  }
  const sw = await Switch.create({
    name: args.name,
    description: args.description,
    commandFile: args.commandFile,
  })
  return sw
}

const setSwitchCommand = async (root, args, context) => {
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  const sw = await Switch.findOne({ where: { id: args.id } })
  sw.command = args.command
  await sw.save()

  if (sw.commandFile && sw.commandFile !== '') {
    try {
      fs.writeFileSync(sw.dataValues.commandFile, args.command ? '1' : '0')
    } catch (err) {
      console.error(err)
    }
  }
  return sw
}

const getSwitchCommand = async (root, args, context) => {
  if (context.token !== SENSOR_TOKEN) {
    throw new AuthenticationError('Not authorized')
  }
  const sw = await Switch.findOne({ where: { name: args.name } })
  return sw.dataValues.command
}

const setSwitchStatus = async (root, args, context) => {
  if (context.token !== SENSOR_TOKEN) {
    throw new AuthenticationError('Not authorized')
  }

  const sw = await Switch.findOne({ where: { name: args.name } })
  sw.on = args.on
  sw.command = args.on
  await sw.save()
  pubsub.publish('STATUS_CHANGED', { statusChanged: sw })
  return sw
}

const resolvers = {
  Query: {
    sensorData,
    currentSensorData,
    allSensors,
    sensorDetails,
    allUsers,
    sensorToken,
    sensorStats,
    datapoints,
    allImages,
    allSwitches,
    getFirstTimestamp,
    getSwitchCommand,
  },
  Mutation: {
    addMeasurement,
    login,
    createUser,
    deleteUser,
    deleteSensor,
    updateSensor,
    newSensor,
    newImage,
    updateImage,
    deleteImage,
    newSwitch,
    updateSwitch,
    deleteSwitch,
    setSwitchCommand,
    setSwitchStatus,
  },
  Subscription: {
    statusChanged: {
      subscribe: () => pubsub.asyncIterator(['STATUS_CHANGED']),
    },
  },
}

module.exports = resolvers
