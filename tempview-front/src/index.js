import ReactDOM from 'react-dom'
import App from './App'

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client'

let uri = 'http://localhost:4000'
if (process.env.NODE_ENV === 'production') {
  uri = '/graphql'
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri,
  }),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
