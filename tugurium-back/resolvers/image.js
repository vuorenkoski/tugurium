const { UserInputError, AuthenticationError } = require('apollo-server')
const { Image } = require('../models')

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
  if (!context.currentUser || !context.currentUser.admin) {
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

module.exports = {
  allImages,
  deleteImage,
  updateImage,
  newImage,
}
