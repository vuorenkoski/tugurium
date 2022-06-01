import { Table, Row, Col, Form, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_USERS, DELETE_USER, CREATE_USER } from '../queries'

const Users = ({ users }) => {
  const [displayUserForm, setDisplayUserForm] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPasssword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const [deleteUser] = useMutation(DELETE_USER, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    },
    refetchQueries: [{ query: ALL_USERS }],
  })

  const [createUser] = useMutation(CREATE_USER, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
    },
    onCompleted: (data) => {
      closeUserForm()
    },
    refetchQueries: [{ query: ALL_USERS }],
  })

  const handeDeleteUser = (id) => {
    const variables = { deleteUserId: Number(id) }
    deleteUser({ variables })
  }

  const handeCreateUser = (id) => {
    setDisplayUserForm(true)
    setUsername('')
    setPasssword('')
  }

  const handleSubmitUser = async (event) => {
    event.preventDefault()
    const variables = { username, password }
    await createUser({ variables })
  }

  const closeUserForm = () => {
    setErrorMessage(null)
    setDisplayUserForm(false)
  }

  return (
    <div>
      <Row className="p-4 pb-1">
        <Col>
          <h3>Käyttäjät</h3>
        </Col>
      </Row>
      <Row className="p-4 pt-1 pb-1">
        <Col className="col-auto">
          <Table striped>
            <tbody>
              <tr>
                <th>Käyttäjänimi</th>
                <th>admin</th>
                <th>Id</th>
                <th></th>
              </tr>
              {users.data &&
                users.data.allUsers.map((a) => (
                  <tr key={a.id}>
                    <td>{a.username}</td>
                    <td>{a.admin && <div>kyllä</div>}</td>
                    <td>{a.id}</td>
                    <td>
                      <button
                        className="removeButton"
                        onClick={() => handeDeleteUser(a.id)}
                      >
                        poista
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {!displayUserForm && (
        <Row className="p-4 pt-1 pb-1">
          <Col>
            <Button onClick={() => handeCreateUser()}>Lisää uusi</Button>
          </Col>
        </Row>
      )}

      {displayUserForm && (
        <Row className="p-4 pt-1 pb-1 align-items-end">
          <Col className="col-auto">
            <Form>
              <Form.Group>
                <Form.Label>Käyttäjänimi</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                />
              </Form.Group>
            </Form>
          </Col>
          <Col className="col-auto">
            <Form>
              <Form.Group>
                <Form.Label>Salasana</Form.Label>
                <Form.Control
                  type="text"
                  value={password}
                  onChange={({ target }) => setPasssword(target.value)}
                />
              </Form.Group>
            </Form>
          </Col>
          <Col className="col-auto">
            <Button onClick={handleSubmitUser}>lisää</Button>
          </Col>
          <Col className="col-auto">
            <Button onClick={closeUserForm}>peruuta</Button>
          </Col>
        </Row>
      )}
      <Row className="p-4">
        <Col className="errorMessage">{errorMessage}</Col>
      </Row>
    </div>
  )
}

export default Users
