const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const http = require('http')

const { Sequelize } = require('sequelize')
const { connectToDatabase } = require('./util/db')
const { User } = require('./models')

const jwt = require('jsonwebtoken')
const { SECRET, SENSOR_TOKEN, PORT, DATABASE_URL } = require('./util/config')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const start = async () => {
  try {
    await connectToDatabase()
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }

  const app = express()

  app.get('/images', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        let data = {}
        data['token'] = auth.substring(7)
        if (data['token'] !== SENSOR_TOKEN) {
          const decodedToken = jwt.verify(data['token'], SECRET)
          data['currentUser'] = await User.findByPk(decodedToken.id)
        }
        return data
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/graphql',
  })

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
