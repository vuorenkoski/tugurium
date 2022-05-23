import { useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/queries'
import useAuthStorage from '../hooks/useAuthStorage'
import { useApolloClient } from '@apollo/client'

const useLogin = () => {
  const [mutate, result] = useMutation(LOGIN)
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()

  const login = async ({ username, password }) => {
    const variables = { username, password }
    const data = await mutate({
      variables,
    })
    console.log(data)

    await authStorage.setAccessToken(data.data.login.value)
    console.log('resetoidaan')
    apolloClient.resetStore()
    console.log('ok')

    return data
  }

  return [login, result]
}

export default useLogin
