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

const {
  allUsers,
  createUser,
  deleteUser,
  login,
  getUser,
  changePassword,
} = require('./user')

const { allMessages, newMessage, addMessage } = require('./message')

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
    allMessages,
  },
  Mutation: {
    addMeasurement,
    login,
    createUser,
    changePassword,
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
    addMessage,
  },
  Subscription: {
    statusChanged,
    newMeasurement,
    newMessage,
  },
}

module.exports = resolvers
