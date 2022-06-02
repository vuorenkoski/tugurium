import Text from './Text'
import FormikTextInput from './FormikTextInput'
import { Formik } from 'formik'
import * as yup from 'yup'
import { View, Pressable, StyleSheet } from 'react-native'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { CHANGE_PASSWORD } from '../graphql/user'
import theme from '../theme'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
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

const initialValues = {
  password: '',
  passwordConfirmation: '',
}

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Salasana on pakollinen')
    .min(6, 'vähintään 5 merkkiä'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
})

const PasswordForm = ({ onSubmit }) => {
  return (
    <View style={styles.inputBox}>
      <FormikTextInput
        name="password"
        placeholder="salasana"
        secureTextEntry={true}
      />
      <FormikTextInput
        name="passwordConfirmation"
        placeholder="salasanan vahvistus"
        secureTextEntry={true}
        style={{ marginTop: 20 }}
      />
      <Pressable onPress={onSubmit}>
        <Text fontWeight="bold" style={styles.button}>
          Vaihda salasana
        </Text>
      </Pressable>
    </View>
  )
}

const PasswordChange = ({ user }) => {
  const [message, setMessage] = useState('')

  const [changePassword] = useMutation(CHANGE_PASSWORD, {
    onError: (error) => {
      if (error.networkError) {
        setMessage('Verkkovirhe (backend ei tavoitettavissa?)')
      } else {
        setMessage(error.message)
      }
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    },
    onCompleted: () => {
      setMessage('Salasana vaihdettu')
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    },
  })

  const handleSubmitPassword = async (values, resetForm) => {
    if (values.password === values.passwordConfirmation) {
      const variables = { password: values.password }
      const { data } = await changePassword({ variables })
      if (data) {
        resetForm()
      }
    } else {
      setMessage('Salasanat eivät täsmää')
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    }
  }

  return (
    <View>
      <View style={styles.labelRow}>
        <Text textType="heading2">Salasanan vaihto</Text>
      </View>
      <View style={styles.Row}>
        <Text>Käyttäjä: {user.username}</Text>
      </View>
      <View style={styles.Row}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) =>
            handleSubmitPassword(values, resetForm)
          }
          validationSchema={validationSchema}
        >
          {({ handleSubmit }) => <PasswordForm onSubmit={handleSubmit} />}
        </Formik>
      </View>
      <View style={styles.Row}>
        <Text>{message}</Text>
      </View>
    </View>
  )
}

export default PasswordChange
