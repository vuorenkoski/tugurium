const { Sensor, Measurement } = require('./models')
var fs = require('fs')

const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./util/config')

const blockSize = 200000

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

const readCsvFile = (filename, sensorName, sensorId) => {
  let data = []
  const content = fs.readFileSync(filename, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    const row = line.split(',')
    const value = parseFloat(row[1])
    // there are some invalid values in old data...
    if (
      !isNaN(value) &&
      (sensorName === 'CLSR' ||
        sensorName === 'FSVI' ||
        (value > -40 && value < 80))
    ) {
      data.push({ timestamp: parseInt(row[0]) / 1000, value, sensorId })
    }
  })
  return data
}

const readCsvMotionFile = (filename, sensorName, sensorId) => {
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

const writeDb = async (data) => {
  for (let block = 0; block * blockSize < data.length; block++) {
    await Measurement.bulkCreate(
      data.slice(
        block * blockSize,
        Math.min(data.length, block * blockSize + blockSize - 1)
      ),
      { logging: false }
    )
    console.log('block', block + 1, 'done')
  }
}

const processFile = async (filename, sensorName, readFunction) => {
  const sensor = await Sensor.findOne({
    where: { sensorName: sensorName },
    logging: false,
  })
  console.log('Importing: ' + filename)
  const data = readFunction(filename, sensorName, sensor.id)
  console.log('File read')
  await writeDb(data)
  console.log('db appended')
  console.log('')
}

const main = async () => {
  await connectToDatabase()
  console.log('block size:', blockSize)
  console.log('')
  for (let i in tables) {
    await processFile(tables[i].filename, tables[i].sensorName, readCsvFile)
  }
  await processFile('../data/liike.csv', 'CMOT', readCsvMotionFile)
}

main()
