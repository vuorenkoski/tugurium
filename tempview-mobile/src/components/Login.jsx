import { useState } from 'react'
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

const initialValues = {
  username: '',
  password: '',
}

const validationSchema = yup.object().shape({
  username: yup.string().required('Käyttäjänimi on pakollinen'),
  password: yup.string().required('Salasana on pakollinen'),
})

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'column',
    padding: 15,
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
    padding: 20,
  },
})

const LoginForm = ({ onSubmit }) => {
  return (
    <View style={styles.inputBox}>
      <FormikTextInput name="username" placeholder="käyttäjänimi" />
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
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => <LoginForm onSubmit={handleSubmit} />}
    </Formik>
  )
}

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const [mutate, result] = useMutation(LOGIN)
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()

  const onSubmit = async ({ username, password }) => {
    const variables = { username, password }
    const data = await mutate({
      variables,
      onError: () => console.log('error'),
    })
    if (data.data) {
      await authStorage.setAccessToken(data.data.login.value)
      apolloClient.resetStore()
      navigate('/current', { exact: true })
    }
    if (!result.data && result.error && result.error.networkError) {
      setErrorMessage('Virhe: Verkkovirhe (backend ei tavoitettavissa?)')
    }
    if (!result.data && result.error && !result.error.networkError) {
      setErrorMessage(result.error.message)
    }
  }

  return (
    <View>
      <LoginContainer onSubmit={onSubmit} />
      <View style={styles.errorText}>
        <Text textType="error">{errorMessage}</Text>
      </View>
    </View>
  )
}

export default Login
