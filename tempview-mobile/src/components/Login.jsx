import Text from './Text'
import FormikTextInput from './FormikTextInput'
import { View, Pressable, StyleSheet } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import theme from '../theme'
import useLogin from '../hooks/useLogin'
import { useNavigate } from 'react-router-native'

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
  const [login] = useLogin()
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    const { username, password } = values

    try {
      await login({ username, password })
      navigate('/current', { exact: true })
    } catch (e) {
      console.log(e)
    }
  }

  return <LoginContainer onSubmit={onSubmit} />
}

export default Login
