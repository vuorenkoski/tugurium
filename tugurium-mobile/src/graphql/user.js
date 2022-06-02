import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      username
    }
  }
`

export const DELETE_USER = gql`
  mutation Mutation($deleteUserId: Int!) {
    deleteUser(id: $deleteUserId) {
      username
    }
  }
`

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        admin
      }
    }
  }
`

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      username
      admin
    }
  }
`

export const ALL_USERS = gql`
  query AllUsers {
    allUsers {
      id
      username
      admin
    }
  }
`
export const CHANGE_PASSWORD = gql`
  mutation Mutation($password: String!) {
    changePassword(password: $password) {
      username
    }
  }
`
