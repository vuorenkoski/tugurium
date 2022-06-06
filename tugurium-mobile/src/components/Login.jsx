import { useState, useEffect } from 'react'
import Text from './Text'
import FormikTextInput from './FormikTextInput'
import { View, Pressable, StyleSheet } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import theme from '../theme'
import { useNavigate } from 'react-router-native'

import { useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/user'
import useAuthStorage from '../hooks/useAuthStorage'
import { useApolloClient } from '@apollo/client'
import { NETWORK_ERROR } from '../utils/config'

const validationSchema = yup.object().shape({
  username: yup.string().required('Käyttäjänimi on pakollinen'),
  password: yup.string().required('Salasana on pakollinen'),
})

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'column',
    padding: 30,
    paddingBottom: 0,
    paddingTop: 0,
  },
  button: {
    color: 'white',
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  loginText: {
    alignItems: 'center',
    margin: 20,
  },
  error: {
    padding: 0,
    margin: 0,
    marginBottom: 10,
  },
})

const LoginForm = ({ onSubmit }) => {
  return (
    <View style={styles.inputBox}>
      <FormikTextInput name="host" placeholder="serveri" />
      <FormikTextInput
        name="username"
        placeholder="käyttäjänimi"
        style={{ marginTop: 20 }}
      />
      <FormikTextInput
        name="password"
        placeholder="salasana"
        secureTextEntry={true}
        style={{ marginTop: 20 }}
      />
      <Pressable onPress={onSubmit}>
        <Text fontWeight="bold" style={styles.button}>
          Kirjaudu sisään
        </Text>
      </Pressable>
    </View>
  )
}

const LoginContainer = ({ onSubmit }) => {
  const [host, setHost] = useState('')
  const authStorage = useAuthStorage()

  useEffect(async () => {
    const hostname = await authStorage.getHost()
    setHost(hostname)
  }, [])

  return (
    <Formik
      initialValues={{
        host,
        username: '',
        password: '',
      }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ handleSubmit }) => <LoginForm onSubmit={handleSubmit} />}
    </Formik>
  )
}

const Login = ({ setUser }) => {
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const [login, { loading }] = useMutation(LOGIN)
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()

  const onSubmit = async ({ host, username, password }) => {
    await authStorage.setHost(host)

    const variables = { username, password }
    await login({
      variables,
      onError: (error) => {
        if (error.networkError) {
          setErrorMessage(NETWORK_ERROR)
        } else {
          setErrorMessage(error.message)
        }
        setTimeout(() => {
          setErrorMessage(null)
        }, 4000)
      },
      onCompleted: async (data) => {
        await authStorage.setAccessToken(data.login.token)
        await authStorage.setUser(data.login.user)
        apolloClient.resetStore()
        setUser(data.login.user)
        navigate('/current', { exact: true })
      },
    })
  }

  return (
    <View>
      <View style={styles.errorText}>
        <Text textType="error" style={styles.error}>
          {errorMessage}
        </Text>
      </View>
      <LoginContainer onSubmit={onSubmit} />
      {loading && (
        <View style={styles.loginText}>
          <Text>Kirjaudutaan...</Text>
        </View>
      )}
    </View>
  )
}

export default Login
