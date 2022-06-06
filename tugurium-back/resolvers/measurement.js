const { UserInputError, AuthenticationError } = require('apollo-server')
const { QueryTypes } = require('sequelize')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const { sequelize } = require('../util/db')
const { Sensor, Measurement } = require('../models')

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

  let minReq = ''
  let maxReq = ''
  if (args.minDate) {
    minReq = `AND timestamp>=${args.minDate} `
  }
  if (args.maxDate) {
    maxReq = `AND timestamp<${args.maxDate} `
  }

  const sensor = await Sensor.findOne({
    where: { sensorName: args.sensorName },
    raw: true,
  })

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
  if (!context.sensor && !context.currentUser && !context.currentUser.admin) {
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
    sensor.lastValue = value
    sensor.lastTimestamp = Math.floor(Date.now() / 1000)
    await sensor.save()
    pubsub.publish('NEW_MEASUREMENT', { newMeasurement: sensor })

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

const newMeasurement = {
  subscribe: () => {
    return pubsub.asyncIterator(['NEW_MEASUREMENT'])
  },
}

module.exports = {
  getFirstTimestamp,
  addMeasurement,
  datapoints,
  sensorData,
  newMeasurement,
}
