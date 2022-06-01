import { gql } from '@apollo/client'

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
`

export const DELETE_SWITCH = gql`
  mutation Mutation($deleteSwitchId: Int!) {
    deleteSwitch(id: $deleteSwitchId) {
      name
    }
  }
`

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
`

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
`

export const SET_SWITCH_COMMAND = gql`
  mutation SetSwitchCommand($command: Boolean!, $setSwitchId: Int!) {
    setSwitchCommand(command: $command, id: $setSwitchId) {
      id
      name
      description
      command
    }
  }
`

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
`
