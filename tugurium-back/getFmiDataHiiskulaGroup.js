// Fetches most recent obaservation data from FMI open data API
//
// Hiiskula fmisid=874863 (temperature 30min interval)
//
// https://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::observations::weather::daily::simple&fmisid=101135&parameters=rrday,snow&starttime=2024-01-01&endtime=2024-12-31

const { Sensor, Measurement } = require('./models')

const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./util/config')

const parseString = require('xml2js').parseString
const http = require('http')

const optionsHiiskula = {
  host: 'opendata.fmi.fi',
  path: '/wfs?request=getFeature&storedquery_id=fmi::observations::weather::daily::simple&fmisid=101135&parameters=rrday,snow&starttime=2014-01-01&endtime=2014-12-31',
}

// define sensornames in database
const nameConversion = {
  rrday: 'FHIS',
  snow: 'FHIL',
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

const parseAndSaveAll = async (data) => {
  for (let i in data['wfs:FeatureCollection']['wfs:member']) {
    const element =
      data['wfs:FeatureCollection']['wfs:member'][i]['BsWfs:BsWfsElement'][0]
    const parameter = element['BsWfs:ParameterName'][0]
    let value = element['BsWfs:ParameterValue'][0]
    const date = new Date(element['BsWfs:Time'][0])
    if (parameter && !isNaN(value)) {
      if (value==-1) {
        value = 0
      }
      const sensor = await Sensor.findOne({
        where: { sensorName: nameConversion[parameter] },
        logging: false })
      const timestamp = date.getTime() / 1000
      const data = {
        sensorId: sensor.id,
        value: parseFloat(value),
        timestamp,
      }
      console.log(data)
      await Measurement.create(data, { logging: false })
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
      parseAndSaveAll(result)
    })
  })
}

const main = async () => {
  await connectToDatabase()
  http.request(optionsHiiskula, callback).end()
}

main()

