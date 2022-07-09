const nodemailer = require('nodemailer')
const { AuthenticationError } = require('apollo-server')
const { Message } = require('../models')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_TO,
  EMAIL_USERNAME,
  EMAIL_FROM,
} = require('../util/config')

const allMessages = async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authorized')
  }

  const messages = await Message.findAll({ order: [['createdAt', 'DESC']] })
  return messages
}

const sendMessage = (message) => {
  var transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  })

  var mailOptions = {
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: 'Viesti Tuguriumista',
    text: message,
  }

  transporter.sendMail(mailOptions)
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
  if (args.important) {
    sendMessage(args.from + ': ' + args.message)
  }
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
