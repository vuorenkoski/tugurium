const { Sensor, Measurement } = require('./models')
var fs = require('fs')

const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./util/config')

const blockSize = 200000

const dateLimit = new Date(2014, 0, 1)

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
  let lastTimestamp = 0
  let lastValue = 0

  const content = fs.readFileSync(filename, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    const row = line.split(',')
    const value = parseFloat(row[1])
    const timestamp = parseInt(row[0]) / 1000
    // there are some invalid values in old data...
    if (
      timestamp * 1000 > dateLimit &&
      !isNaN(value) &&
      (sensorName === 'CLSR' ||
        sensorName === 'FSVI' ||
        (value > -40 && value < 80))
    ) {
      data.push({ timestamp, value, sensorId })
      if (timestamp > lastTimestamp) {
        lastTimestamp = timestamp
        lastValue = value
      }
    }
  })
  return { data, lastTimestamp, lastValue }
}

const readCsvMotionFile = (filename, sensorName, sensorId) => {
  let data = []
  let lastTimestamp = 0
  let lastValue = 1

  const content = fs.readFileSync(filename, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    try {
      const timestamp = parseInt(line) / 1000
      if (timestamp < 2000000000) {
        data.push({ timestamp, value: 1, sensorId })
        if (timestamp > lastTimestamp) {
          lastTimestamp = timestamp
        }
      } else {
        console.log('error:' + line)
      }
    } catch (error) {
      console.log('error:' + line)
    }
  })
  return { data, lastTimestamp, lastValue }
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
  const response = readFunction(filename, sensorName, sensor.id)
  console.log('File read')
  sensor.lastTimestamp = response.lastTimestamp
  sensor.lastValue = response.lastValue
  await sensor.save()
  await writeDb(response.data)
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
