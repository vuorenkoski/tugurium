import { Row, Button, FormControl, InputGroup, Col } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { CHANGE_PASSWORD } from '../graphql/user'

const Users = ({ user }) => {
  const [password, setPasssword] = useState('')
  const [passwordConfirmation, setPassswordConfirmation] = useState('')
  const [message, setMessage] = useState('')

  const [changePassword] = useMutation(CHANGE_PASSWORD, {
    onError: (error) => {
      setMessage(error.message)
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    },
    onCompleted: () => {
      setPasssword('')
      setPassswordConfirmation('')
      setMessage('Salasana vaihdettu')
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    },
  })

  const handleSubmitPassword = async () => {
    if (password === passwordConfirmation) {
      const variables = { password }
      await changePassword({ variables })
    } else {
      setMessage('Salasanat eivät täsmää')
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    }
  }

  return (
    <div>
      <Row className="p-4 pt-3 pb-1">
        <Col>
          <h3>Salasana</h3>
        </Col>
      </Row>
      <Row className="p-4 pt-1 pb-1">
        <Col>
          <p>Käyttäjä: {user.username}</p>
        </Col>
      </Row>
      <Row className="p-4 pt-1 pb-1">
        <Col className="col-auto">
          <InputGroup>
            <FormControl
              type="password"
              value={password}
              placeholder="salasana"
              onChange={({ target }) => setPasssword(target.value)}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="p-4 pt-1 pb-1">
        <Col className="col-auto">
          <InputGroup>
            <FormControl
              type="password"
              value={passwordConfirmation}
              placeholder="salasana uudestaan"
              onChange={({ target }) => setPassswordConfirmation(target.value)}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="p-4 pt-1 pb-1">
        <Col>
          <button
            type="button"
            className="addButton"
            onClick={handleSubmitPassword}
          >
            Vaihda
          </button>
        </Col>
      </Row>
      <Row className="p-4 pt-1 pb-1">
        <Col className="errorMessage">{message}</Col>
      </Row>
    </div>
  )
}

export default Users
