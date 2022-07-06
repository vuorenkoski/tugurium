import { gql } from '@apollo/client'

export const ALL_MESSAGES = gql`
  query AllMessages {
    allMessages {
      id
      from
      message
      important
      createdAt
    }
  }
`

export const NEW_MESSAGE = gql`
  subscription {
    newMessage {
      id
      from
      message
      important
      createdAt
    }
  }
`
