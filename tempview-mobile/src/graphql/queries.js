import { gql } from "@apollo/client";

export const SENSOR_STATS = gql`
  query SensorStats {
    sensorStats {
      sensor {
        sensorFullname
        sensorName
      }
      firstTimestamp
      count
    }
  }
`;

export const DATAPOINTS = gql`
  query Datapoints($sensorName: String) {
    datapoints(sensorName: $sensorName) {
      count
      timestamp
    }
  }
`;

export const ALL_USERS = gql`
  query AllUsers {
    allUsers {
      id
      username
      admin
    }
  }
`;

export const SENSOR_TOKEN = gql`
  query SensorToken {
    sensorToken {
      value
    }
  }
`;

export const GET_FIRST_TIMESTAMP = gql`
  query Query {
    getFirstTimestamp
  }
`;

export const SENSOR_DATA = gql`
  query SensorData(
    $sensorName: String!
    $average: Average
    $minDate: Int
    $maxDate: Int
  ) {
    sensorData(
      sensorName: $sensorName
      average: $average
      minDate: $minDate
      maxDate: $maxDate
    ) {
      sensorName
      sensorFullname
      sensorUnit
      measurements {
        value
        timestamp
      }
    }
  }
`;

export const ALL_SENSORS = gql`
  query AllSensors {
    allSensors {
      id
      sensorName
      sensorFullname
      sensorUnit
      agrmethod
      lastValue
      lastTimestamp
    }
  }
`;

export const DELETE_SENSOR = gql`
  mutation Mutation($deleteSensorId: Int!) {
    deleteSensor(id: $deleteSensorId) {
      sensorName
    }
  }
`;

export const UPDATE_SENSOR = gql`
  mutation UpdateSensor(
    $sensorName: String!
    $sensorFullname: String!
    $sensorUnit: String!
    $updateSensorId: Int!
    $agrmethod: String!
  ) {
    updateSensor(
      sensorName: $sensorName
      sensorFullname: $sensorFullname
      sensorUnit: $sensorUnit
      id: $updateSensorId
      agrmethod: $agrmethod
    ) {
      id
      sensorName
      sensorFullname
      sensorUnit
      agrmethod
    }
  }
`;

export const NEW_SENSOR = gql`
  mutation NewSensor(
    $sensorName: String!
    $sensorFullname: String!
    $sensorUnit: String!
    $agrmethod: String!
  ) {
    newSensor(
      sensorName: $sensorName
      sensorFullname: $sensorFullname
      sensorUnit: $sensorUnit
      agrmethod: $agrmethod
    ) {
      sensorName
      sensorFullname
      sensorUnit
      agrmethod
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      username
    }
  }
`;

export const DELETE_USER = gql`
  mutation Mutation($deleteUserId: Int!) {
    deleteUser(id: $deleteUserId) {
      username
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      username
      admin
    }
  }
`;

export const CURRENT_SENSOR_DATA = gql`
  query Query {
    currentSensorData {
      timestamp
      value
      sensor {
        sensorFullname
        sensorUnit
      }
    }
  }
`;
// Images

export const ALL_IMAGES = gql`
  query AllImages {
    allImages {
      id
      name
      description
      updatedAt
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation Mutation($deleteImageId: Int!) {
    deleteImage(id: $deleteImageId) {
      name
    }
  }
`;

export const UPDATE_IMAGE = gql`
  mutation UpdateImage(
    $name: String!
    $description: String!
    $updateImageId: Int!
  ) {
    updateImage(name: $name, description: $description, id: $updateImageId) {
      id
      name
      description
    }
  }
`;

export const NEW_IMAGE = gql`
  mutation NewImage($name: String!, $description: String!) {
    newImage(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

// Switches

export const ALL_SWITCHES = gql`
  query AllSwitches {
    allSwitches {
      id
      name
      description
      commandFile
      command
      on
      updatedAt
    }
  }
`;

export const DELETE_SWITCH = gql`
  mutation Mutation($deleteSwitchId: Int!) {
    deleteSwitch(id: $deleteSwitchId) {
      name
    }
  }
`;

export const UPDATE_SWITCH = gql`
  mutation UpdateSwitch(
    $name: String!
    $description: String!
    $commandFile: String!
    $updateSwitchId: Int!
  ) {
    updateSwitch(
      name: $name
      description: $description
      id: $updateSwitchId
      commandFile: $commandFile
    ) {
      id
      name
      description
      commandFile
    }
  }
`;

export const NEW_SWITCH = gql`
  mutation NewSwitch(
    $name: String!
    $description: String!
    $commandFile: String!
  ) {
    newSwitch(
      name: $name
      description: $description
      commandFile: $commandFile
    ) {
      id
      name
      description
      commandFile
    }
  }
`;

export const SET_SWITCH_COMMAND = gql`
  mutation SetSwitchCommand($command: Boolean!, $setSwitchId: Int!) {
    setSwitchCommand(command: $command, id: $setSwitchId) {
      id
      name
      description
      command
    }
  }
`;

export const STATUS_CHANGED = gql`
  subscription {
    statusChanged {
      id
      description
      command
      on
      updatedAt
    }
  }
`;

export const NEW_MEASUREMENT = gql`
  subscription {
    newMeasurement {
      id
      sensorName
      sensorFullname
      sensorUnit
      agrmethod
      lastValue
      lastTimestamp
    }
  }
`;
