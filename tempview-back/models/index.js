const Measurement = require('./measurement')
const Sensor = require('./sensor')

Sensor.hasMany(Measurement)
Measurement.belongsTo(Sensor)

module.exports = {
  Measurement,
  Sensor,
}
