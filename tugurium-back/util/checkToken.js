const jwt = require('jsonwebtoken')

const { User } = require('../models')
const { SECRET, SENSOR_TOKEN } = require('./config')

const checkToken = async (auth) => {
  let data = {}
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    data.token = auth.substring(7)
    data.sensor = data.token === SENSOR_TOKEN
    if (!data.sensor) {
      try {
        const decodedToken = jwt.verify(data['token'], SECRET)
        data.currentUser = await User.findByPk(decodedToken.id)
      } catch (error) {
        return data
      }
    }
  }
  return data
}

module.exports = checkToken
