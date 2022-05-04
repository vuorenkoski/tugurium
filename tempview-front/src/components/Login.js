import { useState, useEffect } from 'react'
import { Form, Row, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0])
    },
  })

  useEffect(() => {
    if (result.data) {
      console.log(result.data)
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('tempview-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  const handleLogin = async (event) => {
    event.preventDefault()
    const variables = { username, password }
    console.log(variables)
    login({ variables })
  }

  return (
    <div>
      <Row className="p-4">
        <h2>Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Käyttäjänimi</Form.Label>
            <Form.Control
              type="text"
              placeholder="anna käyttäjänimi"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Salasana</Form.Label>
            <Form.Control
              type="password"
              placeholder="salasana"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            kirjaudu
          </Button>
        </Form>
        {errorMessage}
      </Row>
    </div>
  )
}

export default Login
