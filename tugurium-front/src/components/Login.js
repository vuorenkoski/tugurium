import { useState } from 'react'
import { Form, Row, Button, Col } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/user'
import { NETWORK_ERROR } from '../util/config'

const Login = ({ setLogged }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [login] = useMutation(LOGIN, {
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
    onCompleted: (data) => {
      const token = data.login.token
      localStorage.setItem('tugurium-user-token', token)
      localStorage.setItem('tugurium-user', JSON.stringify(data.login.user))
      window.location.reload(false)
      setLogged(true)
    },
  })

  const handleLogin = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <Row className="p-4">
        <Col className="col-auto">
          <h2>Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Käyttäjänimi</Form.Label>
              <Form.Control
                type="text"
                placeholder="käyttäjänimi"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
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
        </Col>
      </Row>
      <Row className="p-4" style={{ color: 'red' }}>
        {errorMessage}
      </Row>
    </div>
  )
}

export default Login
