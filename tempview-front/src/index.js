import ReactDOM from 'react-dom'
import App from './App'
import { setContext } from 'apollo-link-context'

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('tempview-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  }
})

let uri = 'http://localhost:4000'
if (process.env.NODE_ENV === 'production') {
  uri = '/graphql'
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(
    new HttpLink({
      uri,
    })
  ),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
