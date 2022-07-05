const { AuthenticationError } = require('apollo-server')
const { Message } = require('../models')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const allMessages = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  const messages = await Message.findAll({ order: [['createdAt', 'DESC']] })
  return messages
}

const addMessage = async (root, args, context) => {
  if (!context.currentUser && !context.sensor) {
    throw new AuthenticationError('Not authorized')
  }
  const message = await Message.create({
    from: args.from,
    message: args.message,
    important: args.important,
  })
  pubsub.publish('NEW_MESSAGE', { newMessage: message })
  return message
}

const newMessage = {
  subscribe: () => {
    return pubsub.asyncIterator(['NEW_MESSAGE'])
  },
}

module.exports = {
  allMessages,
  newMessage,
  addMessage,
}
