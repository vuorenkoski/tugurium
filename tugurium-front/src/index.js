import './index.css'

import ReactDOM from 'react-dom'
import App from './App'
import { setContext } from 'apollo-link-context'

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  split,
} from '@apollo/client'

import { getMainDefinition } from '@apollo/client/utilities'

import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const { BACKEND_URL, WEBSOCKET_URL } = require('./util/config')

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('tugurium-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  }
})

const httpLink = new HttpLink({
  uri: BACKEND_URL + '/graphql',
})

const link = new GraphQLWsLink(
  createClient({
    url: WEBSOCKET_URL,
    connectionParams: {
      authToken: `bearer ${localStorage.getItem('tugurium-user-token')}`,
    },
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  link,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
