const { allImages, deleteImage, newImage, updateImage } = require('./image')

const {
  allSwitches,
  deleteSwitch,
  getSwitchCommand,
  newSwitch,
  setSwitchCommand,
  setSwitchStatus,
  updateSwitch,
  statusChanged,
} = require('./switch')

const {
  getFirstTimestamp,
  addMeasurement,
  datapoints,
  sensorData,
  newMeasurement,
} = require('./measurement')

const {
  allSensors,
  deleteSensor,
  newSensor,
  sensorDetails,
  sensorStats,
  sensorToken,
  updateSensor,
  currentSensorData,
} = require('./sensor')

const { allUsers, createUser, deleteUser, login, getUser } = require('./user')

const resolvers = {
  Query: {
    sensorData,
    currentSensorData,
    allSensors,
    sensorDetails,
    allUsers,
    sensorToken,
    sensorStats,
    datapoints,
    allImages,
    allSwitches,
    getFirstTimestamp,
    getSwitchCommand,
    getUser,
  },
  Mutation: {
    addMeasurement,
    login,
    createUser,
    deleteUser,
    deleteSensor,
    updateSensor,
    newSensor,
    newImage,
    updateImage,
    deleteImage,
    newSwitch,
    updateSwitch,
    deleteSwitch,
    setSwitchCommand,
    setSwitchStatus,
  },
  Subscription: {
    statusChanged,
    newMeasurement,
  },
}

module.exports = resolvers
