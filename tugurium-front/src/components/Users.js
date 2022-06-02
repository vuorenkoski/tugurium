import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  Container,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_USERS, DELETE_USER, CREATE_USER } from '../graphql/user'

const Users = ({ admin }) => {
  const [displayUserForm, setDisplayUserForm] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPasssword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [deleteUserId, setDeleteUserId] = useState(null)

  const users = useQuery(ALL_USERS)

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: ALL_USERS }],
  })

  const [createUser] = useMutation(CREATE_USER, {
    onError: (error) => {
      setErrorMessage(error.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    },
    onCompleted: (data) => {
      closeUserForm()
    },
    refetchQueries: [{ query: ALL_USERS }],
  })

  const handleDeleteUser = () => {
    const id = deleteUserId.id
    const variables = { deleteUserId: Number(id) }
    deleteUser({ variables })
    setDeleteUserId(null)
  }

  const handeCreateUser = (id) => {
    setDisplayUserForm(true)
    setUsername('')
    setPasssword('')
  }

  const handleSubmitUser = async () => {
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
                {admin && <th></th>}
              </tr>
              {users.data &&
                users.data.allUsers.map((a) => (
                  <tr key={a.id}>
                    <td>{a.username}</td>
                    <td>{a.admin ? 'kyllä' : 'ei'}</td>
                    {admin && !a.admin && (
                      <td>
                        <button
                          className="removeButton"
                          onClick={() => setDeleteUserId(a)}
                        >
                          poista
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {admin && (
        <Row className="p-4 pt-1 pb-1">
          <Col>
            <Button onClick={() => handeCreateUser()}>Lisää uusi</Button>
          </Col>
        </Row>
      )}

      <Modal show={deleteUserId} onHide={() => setDeleteUserId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Käyttäjän poistaminen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <h2>{deleteUserId?.username}</h2>
            </Row>
            <Row>
              <p>Oletko varma että haluat poistaa käyttäjän?</p>
            </Row>
            <Row className="p-4">
              <Col className="col-auto">
                <Button onClick={handleDeleteUser}>Poista</Button>
              </Col>
              <Col className="col-auto">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteUserId(null)}
                >
                  Peruuta
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal show={displayUserForm} onHide={closeUserForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Käyttäjä</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  value={username}
                  placeholder="nimi"
                  onChange={({ target }) => setUsername(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  value={password}
                  placeholder="salasana"
                  onChange={({ target }) => setPasssword(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="p-4">
              <Col className="col-auto">
                <Button onClick={handleSubmitUser}>Lisää</Button>
              </Col>
              <Col className="col-auto">
                <Button variant="secondary" onClick={closeUserForm}>
                  Peruuta
                </Button>
              </Col>
            </Row>
            <Row className="p-4 pt-0">
              <Col className="errorMessage">{errorMessage}</Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Users
