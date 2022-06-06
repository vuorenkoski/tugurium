const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { Sequelize } = require('sequelize')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { createServer } = require('http')
const express = require('express')
const cors = require('cors')

const apiRouter = require('./controllers/apiRouter')
const { connectToDatabase } = require('./util/db')
const checkToken = require('./util/checkToken')
const { PORT, DATABASE_URL } = require('./util/config')
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

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Headers:  ', request.headers)
//   console.log('---')
//   next()
// }

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
  // app.use(requestLogger)
  app.use(cors())
  app.use(apiRouter)

  const httpServer = createServer(app)
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/api/graphql',
  })

  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (ctx) => {
        const userData = await checkToken(
          ctx ? ctx.connectionParams.authToken : null
        )
        if (!userData.sensor && !userData.currentUser) {
          return false
        }
      },
    },
    wsServer
  )

  const server = new ApolloServer({
    schema,
    context: ({ req }) => checkToken(req ? req.headers.authorization : null),
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()
  server.applyMiddleware({
    app,
    path: '/api/graphql',
  })

  app.use(express.static('../tugurium-front/build'))
  app.use(
    '*',
    express.static('../tugurium-front/build', { index: 'index.html' })
  )

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on port ${PORT}`)
  )
}

start()
