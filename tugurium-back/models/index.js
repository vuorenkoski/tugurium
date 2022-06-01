const Measurement = require('./measurement')
const Sensor = require('./sensor')
const User = require('./user')
const Image = require('./image')
const Switch = require('./switch')

Sensor.hasMany(Measurement)
Measurement.belongsTo(Sensor)

module.exports = {
  Measurement,
  Sensor,
  User,
  Image,
  Switch,
}
