import { useQuery } from '@apollo/client'

import { GET_USER } from '../graphql/queries'

const useGetUser = () => {
  const { loading, data } = useQuery(GET_USER)
  return { user: data?.getUser, loading }
}

export default useGetUser
