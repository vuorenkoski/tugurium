const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const { allImages, deleteImage, newImage, updateImage } = require('./image')

const {
  allSwitches,
  deleteSwitch,
  getSwitchCommand,
  newSwitch,
  setSwitchCommand,
  setSwitchStatus,
  updateSwitch,
} = require('./switch')

const {
  getFirstTimestamp,
  addMeasurement,
  datapoints,
  sensorData,
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

const { allUsers, createUser, deleteUser, login } = require('./user')

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
    statusChanged: {
      subscribe: () => pubsub.asyncIterator(['STATUS_CHANGED']),
    },
    newMeasurement: {
      subscribe: () => pubsub.asyncIterator(['NEW_MEASUREMENT']),
    },
  },
}

module.exports = resolvers
