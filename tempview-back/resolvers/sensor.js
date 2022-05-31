const { UserInputError, AuthenticationError } = require('apollo-server')
const { Sensor, Measurement } = require('../models')
const { QueryTypes } = require('sequelize')

const { sequelize } = require('../util/db')
const { SENSOR_TOKEN } = require('../util/config')

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
    GROUP BY sensor_id) AS measurement INNER JOIN sensors AS sensor ON sensor.id=measurement.sensor_id ORDER BY sensor.sensor_name`,
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
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  return { value: SENSOR_TOKEN }
}

const currentSensorData = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

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

module.exports = {
  allSensors,
  deleteSensor,
  newSensor,
  sensorDetails,
  sensorStats,
  sensorToken,
  updateSensor,
  currentSensorData,
}
