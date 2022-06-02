import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  Container,
  InputGroup,
  FormControl,
} from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  ALL_SWITCHES,
  DELETE_SWITCH,
  UPDATE_SWITCH,
  NEW_SWITCH,
} from '../graphql/switch'
import { convertDate } from '../util/conversions'

const Switches = ({ admin }) => {
  const [displaySwitchForm, setDisplaySwitchForm] = useState(false)
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [description, setDescription] = useState('')
  const [commandFile, setCommandFile] = useState('')
  const [switchId, setSwitchId] = useState(-1)
  const switches = useQuery(ALL_SWITCHES)

  const [deleteSwitch] = useMutation(DELETE_SWITCH, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    },
    refetchQueries: [{ query: ALL_SWITCHES }],
  })

  const [updateSwitch] = useMutation(UPDATE_SWITCH, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    },
    onCompleted: (data) => {
      closeSwitchForm()
    },
    refetchQueries: [{ query: ALL_SWITCHES }],
  })

  const [newSwitch] = useMutation(NEW_SWITCH, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
    },
    onCompleted: (data) => {
      closeSwitchForm()
    },
    refetchQueries: [{ query: ALL_SWITCHES }],
  })

  const handleDeleteSwitch = (id) => {
    const variables = { deleteSwitchId: Number(id) }
    deleteSwitch({ variables })
  }

  const handleUpdateSwitch = (id) => {
    setDisplaySwitchForm(true)
    const sw = switches.data.allSwitches.filter((s) => s.id === id)[0]
    setName(sw.name)
    setDescription(sw.description)
    setCommandFile(sw.commandFile)
    setSwitchId(Number(sw.id))
  }

  const handleNewSwitch = (id) => {
    setDisplaySwitchForm(true)
    setName('')
    setDescription('')
    setCommandFile('')
    setSwitchId(-1)
  }

  const handleSubmitSwitch = async (event) => {
    event.preventDefault()
    if (switchId === -1) {
      const variables = { name, description, commandFile }
      await newSwitch({ variables })
    } else {
      const variables = {
        name,
        description,
        commandFile,
        updateSwitchId: switchId,
      }
      await updateSwitch({ variables })
    }
  }

  const closeSwitchForm = () => {
    setErrorMessage(null)
    setDisplaySwitchForm(false)
  }

  return (
    <div>
      <Row className="p-4 pb-1">
        <Col>
          <h3>Kytkimet</h3>
        </Col>
      </Row>
      <Row className="p-4 pt-1 pb-1">
        <Col className="col-auto">
          <Table striped>
            <tbody>
              <tr>
                <th>Nimi</th>
                <th>Kuvaus</th>
                <th>komentotiedosto</th>
                <th>Päivitetty</th>
                {admin && (
                  <>
                    <th></th>
                    <th></th>
                  </>
                )}
              </tr>
              {switches.data &&
                switches.data.allSwitches.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.description}</td>
                    <td>{a.commandFile}</td>
                    <td>{convertDate(a.updatedAt / 1000)}</td>
                    {admin && (
                      <>
                        <td>
                          <button
                            className="removeButton"
                            onClick={() => handleDeleteSwitch(a.id)}
                          >
                            poista
                          </button>
                        </td>
                        <td>
                          <button
                            className="updateButton"
                            onClick={() => handleUpdateSwitch(a.id)}
                          >
                            päivitä
                          </button>
                        </td>
                      </>
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
            <Button onClick={() => handleNewSwitch()}>Lisää uusi</Button>
          </Col>
        </Row>
      )}

      <Modal show={displaySwitchForm} onHide={closeSwitchForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kytkin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  value={name}
                  placeholder="nimi"
                  onChange={({ target }) => setName(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  value={description}
                  placeholder="kuvaus"
                  onChange={({ target }) => setDescription(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  value={commandFile}
                  placeholder="komentotiedosto"
                  onChange={({ target }) => setCommandFile(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="p-4">
              <Col className="col-auto">
                <Button onClick={handleSubmitSwitch}>
                  {switchId === -1 ? 'Lisää uusi' : 'Päivitä tiedot'}
                </Button>
              </Col>
              <Col className="col-auto">
                <Button variant="secondary" onClick={closeSwitchForm}>
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

export default Switches
