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

  let measurements = null
  let ms = []

  if (period === 1) {
    measurements = await sequelize.query(
      `SELECT value, timestamp, id FROM measurements WHERE sensor_id='${sensor.id}' ${minReq}${maxReq}`,
      { nest: true, type: QueryTypes.SELECT }
    )
  } else {
    measurements = await sequelize.query(
      `SELECT ${sensor.agrmethod}(value) as value, timestamp / ${period} as timestamp
         FROM measurements WHERE sensor_id='${sensor.id}' ${minReq}${maxReq}GROUP BY timestamp / ${period}`,
      { nest: true, type: QueryTypes.SELECT }
    )
    if (sensor.agrmethod === 'SUM') {
      measurements = measurements.sort((a, b) => a.timestamp - b.timestamp)
      idx = 0
      for (let i = 0; i < measurements.length; i++) {
        if (idx != 0) {
          idx += 1
          while (idx < measurements[i].timestamp) {
            ms.push({ value: 0, timestamp: idx, })
            idx += 1
          }
        } else {
          idx = measurements[i].timestamp
        }
        ms.push(measurements[i])
      }
      measurements = ms
    }

    measurements = measurements.map((m) => ({
      value: m.value,
      timestamp: m.timestamp * period,
      id: null,
    }))
  }
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

const deleteMeasurement = async (root, args, context) => {
  if (!context.currentUser || !context.currentUser.admin) {
    throw new AuthenticationError('Not authorized')
  }

  const measurement = await Measurement.findOne({ where: { id: args.id } })
  await measurement.destroy()
  return measurement
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
  deleteMeasurement,
  datapoints,
  sensorData,
  newMeasurement,
}
