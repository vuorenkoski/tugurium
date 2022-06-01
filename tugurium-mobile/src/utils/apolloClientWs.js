import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from 'apollo-link-context'

const { BACKEND_URL, WEBSOCKET_URL } = require('./config')

const createApolloClient = (authStorage) => {
  const authLink = setContext(async (_, { headers }) => {
    const token = await authStorage.getAccessToken()
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

  const wsLink = new WebSocketLink({
    uri: WEBSOCKET_URL,
    options: {
      reconnect: true,
      connectionParams: async () => {
        const token = await authStorage.getAccessToken()
        return {
          authLink: `bearer ${token}`,
        }
      },
    },
  })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    authLink.concat(httpLink)
  )

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
  })
  return client
}

export default createApolloClient
