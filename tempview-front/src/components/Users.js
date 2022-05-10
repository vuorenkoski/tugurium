import { Table, Row, Col, Form, Button } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_USERS, DELETE_USER, CREATE_USER } from '../queries'

const Users = () => {
  const [displayUserForm, setDisplayUserForm] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPasssword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const users = useQuery(ALL_USERS)

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
    <Row className="p-4">
      <h2>Käyttäjät</h2>
      <Col className="col-8">
        <Row>
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
                        style={{
                          color: 'red',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          font: 'inherit',
                        }}
                        onClick={() => handeDeleteUser(a.id)}
                      >
                        poista
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Row>

        {displayUserForm && (
          <div>
            <Row className="align-items-end">
              <Col className="col-2">
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
              <Col className="col-4">
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
              <Col className="col-2">
                <Button onClick={handleSubmitUser}>lisää</Button>
              </Col>
              <Col className="col-2">
                <Button onClick={closeUserForm}>peruuta</Button>
              </Col>
            </Row>
          </div>
        )}
        {!displayUserForm && (
          <Button onClick={() => handeCreateUser()}>Lisää uusi</Button>
        )}
        <Row className="p-4" style={{ color: 'red' }}>
          {errorMessage}
        </Row>
      </Col>
    </Row>
  )
}

export default Users
