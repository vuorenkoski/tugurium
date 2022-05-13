import ReactDOM from 'react-dom'
import App from './App'
import { setContext } from 'apollo-link-context'

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client'

const { BACKEND_URL } = require('./util/config')

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('tempview-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(
    new HttpLink({
      uri: BACKEND_URL + '/graphql',
    })
  ),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
