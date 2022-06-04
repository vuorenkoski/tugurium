const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const { Sequelize } = require('sequelize')

const { connectToDatabase } = require('./util/db')
const { User, Image } = require('./models')

const jwt = require('jsonwebtoken')
const {
  SECRET,
  SENSOR_TOKEN,
  PORT,
  DATABASE_URL,
  VERSION,
} = require('./util/config')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const multer = require('multer')

const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { createServer } = require('http')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const checkToken = async ({ req }) => {
  const auth = req ? req.headers.authorization : null
  let data = {}
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    data['token'] = auth.substring(7)
    if (data['token'] !== SENSOR_TOKEN) {
      try {
        const decodedToken = jwt.verify(data['token'], SECRET)
        data['currentUser'] = await User.findByPk(decodedToken.id)
      } catch (error) {
        return data
      }
    }
  }
  return data
}

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
  app.use(cors())

  app.get('/api/version', (req, res) => {
    res.send(`Tugurium, version ${VERSION}`)
  })

  app.get('/api/image/:name', (req, res) => {
    checkToken({ req }).then((user) => {
      if (!user.currentUser) {
        res.status(401).send('unauthorized')
      } else {
        Image.findOne({ where: { name: req.params.name } }).then(
          (image) => {
            if (image && image.image) {
              var img = Buffer.from(image.image, 'base64')

              res.writeHead(200, {
                'Content-Type': 'image/jpg',
                'Content-Length': img.length,
              })
              res.end(img)
            } else {
              res.status(400).send('no such image slot')
            }
          },
          (error) => {
            res.status(400).send(error)
          }
        )
      }
    })
  })

  app.post('/api/image/:name', multer().single('file'), (req, res) => {
    checkToken({ req }).then(
      (user) => {
        if (user.token !== SENSOR_TOKEN) {
          res.status(401).send('unauthorized')
        } else {
          Image.findOne({ where: { name: req.params.name } }).then((image) => {
            if (image) {
              image['image'] = req.file.buffer
              image.save()
              res.send('ok')
            } else {
              res.status(400).send('no such image slot')
            }
          })
        }
      },
      (error) => {
        res.send(error)
      }
    )
  })

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
        const token = ctx.connectionParams.authToken
        if (token && token.toLowerCase().startsWith('bearer ')) {
          try {
            jwt.verify(token.substring(7), SECRET)
          } catch (error) {
            return false
          }
        } else {
          return false
        }
      },
    },
    wsServer
  )

  const server = new ApolloServer({
    schema,
    context: checkToken,
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
