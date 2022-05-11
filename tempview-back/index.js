const { ApolloServer } = require('apollo-server')
const { Sequelize } = require('sequelize')
const { connectToDatabase } = require('./util/db')
const { User } = require('./models')

const jwt = require('jsonwebtoken')
const { SECRET, SENSOR_TOKEN } = require('./util/config')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let data = {}
    if (
      req.headers.authorization &&
      req.headers.authorization.toLowerCase().startsWith('bearer ')
    ) {
      data['token'] = req.headers.authorization.substring(7)
      if (data['token'] !== SENSOR_TOKEN) {
        const decodedToken = jwt.verify(data['token'], SECRET)
        data['currentUser'] = await User.findOne({
          where: { id: decodedToken.id },
        })
      }
    }
    return data
  },
})

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const main = async () => {
  try {
    await connectToDatabase()
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
  main()
})
