const { Sensor, Measurement } = require('./models')
var fs = require('fs')

const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./util/config')

const tables = [
  { filename: '../data/kellarissa.csv', sensorName: 'CKEL' },
  { filename: '../data/sisalla.csv', sensorName: 'CINS' },
  { filename: '../data/ulkona.csv', sensorName: 'COUT' },
  { filename: '../data/rauhalassa.csv', sensorName: 'CRAU' },
  { filename: '../data/jarvessa.csv', sensorName: 'CLAK' },
  { filename: '../data/saunassa.csv', sensorName: 'CSAU' },
  { filename: '../data/ylakerta.csv', sensorName: 'HUPS' },
  { filename: '../data/alakerta.csv', sensorName: 'HDOW' },
  { filename: '../data/lampo_roykka.csv', sensorName: 'FTVI' },
  { filename: '../data/sade.csv', sensorName: 'FRVI' },
  { filename: '../data/lumi.csv', sensorName: 'FSVI' },
  { filename: '../data/tuuli.csv', sensorName: 'FWVI' },
  { filename: '../data/jarvenpinta.csv', sensorName: 'CLSR' },
]

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('database connected')
  } catch (err) {
    console.log('connecting database failed')
    console.log(err)
    return process.exit(1)
  }
  return null
}

const readCsvFile = (filename, sensorId) => {
  let data = []
  const content = fs.readFileSync(filename, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    const row = line.split(',')
    const value = parseFloat(row[1])
    if (!isNaN(value) && value > -150 && value < 150) {
      data.push({ timestamp: parseInt(row[0]) / 1000, value, sensorId })
    }
  })
  return data
}

const readCsvMotionFile = (filename, sensorId) => {
  let data = []
  const content = fs.readFileSync(filename, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    try {
      const timestamp = parseInt(line) / 1000
      if (timestamp < 2000000000) {
        data.push({ timestamp, value: 1, sensorId })
      } else {
        console.log('error:' + line)
      }
    } catch (error) {
      console.log('error:' + line)
    }
  })
  return data
}

const main = async () => {
  await connectToDatabase()
  for (let i in tables) {
    const sensor = await Sensor.findOne({
      where: { sensorName: tables[i].sensorName },
    })
    console.log('Importing: ' + tables[i].filename)
    const data = readCsvFile(tables[i].filename, sensor.id)
    console.log('File read')
    await Measurement.bulkCreate(data, { logging: false })
    console.log('db appended')
  }

  const filename = '../data/liike.csv'
  const sensorName = 'CMOT'
  const sensor = await Sensor.findOne({
    where: { sensorName: sensorName },
  })
  console.log('Importing: ' + filename)
  const data = readCsvMotionFile(filename, sensor.id)
  console.log('File read')
  await Measurement.bulkCreate(data, { logging: false })
  console.log('db appended')
}

main()
