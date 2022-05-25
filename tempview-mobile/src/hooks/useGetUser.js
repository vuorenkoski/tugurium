import { useQuery } from '@apollo/client'

import { GET_USER } from '../graphql/user'

const useGetUser = () => {
  const { loading, data } = useQuery(GET_USER, {
    onError: (e) => console.log('virhe', e),
  })
  return { user: data?.getUser, loading }
}

export default useGetUser
