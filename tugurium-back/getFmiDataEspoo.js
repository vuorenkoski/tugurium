// Fetches most recent obaservation data from FMI open data API
//
// Espoo fmisid=874863 (temperature 30min interval)

const { Sensor, Measurement } = require('./models')

const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./util/config')

const parseString = require('xml2js').parseString
const http = require('http')

const optionsEspoo = {
  host: 'opendata.fmi.fi',
  path: '/wfs?request=getFeature&storedquery_id=fmi::observations::weather::simple&fmisid=874863&parameters=temperature&timestep=30',
}

// define sensornames in database
const nameConversion = {
  temperature: 'FESP',
}

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

const parseAndSaveMostRecent = async (data) => {
  let response = {}
  for (let i in data['wfs:FeatureCollection']['wfs:member']) {
    const element =
      data['wfs:FeatureCollection']['wfs:member'][i]['BsWfs:BsWfsElement'][0]
    const parameter = element['BsWfs:ParameterName'][0]
    const value = element['BsWfs:ParameterValue'][0]
    const date = new Date(element['BsWfs:Time'][0])
    if (!response[parameter]) {
      response[parameter] = {}
    }
    if (!response[parameter].date || response[parameter].date < date) {
      response[parameter].date = date
      response[parameter].value = value
    }
  }
  const keys = Object.keys(response)
  for (let i in keys) {
    // Only 1.5 hour difference is allowed comapred to current time
    if (new Date() - response[keys[i]].date < 90 * 60 * 1000) {
      const sensor = await Sensor.findOne({
        where: { sensorName: nameConversion[keys[i]] },
      })
      const value = parseFloat(response[keys[i]].value)
      if (!isNaN(value)) {
        const timestamp = response[keys[i]].date.getTime() / 1000
        const data = {
          sensorId: sensor.id,
          value,
          timestamp,
        }
        sensor.lastTimestamp = timestamp
        sensor.lastValue = value
        await sensor.save()
        await Measurement.create(data, { logging: false })
      }
    }
  }
}

const callback = (response) => {
  let xml = ''

  response.on('data', function (chunk) {
    xml += chunk
  })

  response.on('end', () => {
    parseString(xml, function (err, result) {
      parseAndSaveMostRecent(result)
    })
  })
}

const main = async () => {
  await connectToDatabase()
  http.request(optionsEspoo, callback).end()
}

main()
