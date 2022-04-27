const Measurement = require('./measurement')
const Sensor = require('./sensor')
const User = require('./user')

Sensor.hasMany(Measurement)
Measurement.belongsTo(Sensor)

module.exports = {
  Measurement,
  Sensor,
  User,
}
