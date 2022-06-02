const { UserInputError, AuthenticationError } = require('apollo-server')
const { User } = require('../models')
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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

  return { token, user }
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

const getUser = async (root, args, context) => {
  if (!context.currentUser) {
    return null
  }
  return context.currentUser
}

module.exports = {
  allUsers,
  createUser,
  deleteUser,
  login,
  getUser,
}
