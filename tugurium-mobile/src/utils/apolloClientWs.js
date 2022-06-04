import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from 'apollo-link-context'

import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const createApolloClient = (authStorage) => {
  const authLink = setContext(async (_, { headers }) => {
    const token = await authStorage.getAccessToken()
    const host = await authStorage.getHost()
    return {
      uri: host ? `https://${host}/api/graphql` : null,
      headers: {
        ...headers,
        authorization: token ? `bearer ${token}` : null,
      },
    }
  })

  const link = new GraphQLWsLink(
    createClient({
      url: async () => {
        const host = await authStorage.getHost()
        return host ? `wss://${host}/api/graphql` : null
      },
      connectionParams: async () => {
        const token = await authStorage.getAccessToken()
        return {
          authToken: token ? `bearer ${token}` : null,
        }
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
    authLink.concat(new HttpLink())
  )

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
  })
  return client
}

export default createApolloClient
