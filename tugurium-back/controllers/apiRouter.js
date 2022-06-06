const apiRouter = require('express').Router()
const { Image } = require('../models')
const multer = require('multer')
const { SENSOR_TOKEN, VERSION } = require('../util/config')
const checkToken = require('../util/checkToken')

apiRouter.get('/api/version', (req, res) => {
  res.send(`Tugurium ${VERSION}`)
})

apiRouter.get('/api/image/:name', (req, res) => {
  checkToken(req ? req.headers.authorization : null).then((user) => {
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

apiRouter.post('/api/image/:name', multer().single('file'), (req, res) => {
  checkToken(req ? req.headers.authorization : null).then(
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

module.exports = apiRouter
