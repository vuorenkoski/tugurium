require('dotenv').config()

module.exports = {
  VERSION: '0.9.3',
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 4000,
  SECRET: process.env.SECRET,
  SENSOR_TOKEN: process.env.SENSOR_TOKEN,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
}
