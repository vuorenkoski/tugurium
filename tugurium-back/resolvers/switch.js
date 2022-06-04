const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const fs = require('fs')
const { Switch } = require('../models')
const { SENSOR_TOKEN } = require('../util/config')

const pubsub = new PubSub()

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
  if (!context.currentUser || !context.currentUser.admin) {
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
  pubsub.publish('STATUS_CHANGED', { statusChanged: sw })
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

const statusChanged = {
  subscribe: () => pubsub.asyncIterator(['STATUS_CHANGED']),
}

module.exports = {
  allSwitches,
  deleteSwitch,
  getSwitchCommand,
  newSwitch,
  setSwitchCommand,
  updateSwitch,
  setSwitchStatus,
  statusChanged,
}
