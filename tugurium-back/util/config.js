require('dotenv').config()

module.exports = {
  VERSION: '1.0.2',
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 4000,
  SECRET: process.env.SECRET,
  SENSOR_TOKEN: process.env.SENSOR_TOKEN,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_TO: process.env.EMAIL_TO,
  EMAIL_FROM: process.env.EMAIL_FROM,
}
