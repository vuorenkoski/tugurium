import { Table, Row, Col, Form, Button } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  ALL_SWITCHES,
  DELETE_SWITCH,
  UPDATE_SWITCH,
  NEW_SWITCH,
} from '../queries'
import { convertDate } from '../util/conversions'

const Switches = () => {
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
    <Row className="p-4 pb-0">
      <h2>Kytkimet</h2>
      <Col className="col-8">
        <Row>
          <Table striped>
            <tbody>
              <tr>
                <th>Nimi</th>
                <th>Kuvaus</th>
                <th>komentotiedosto</th>
                <th>Päivitetty</th>
                <th>Id</th>
                <th></th>
                <th></th>
              </tr>
              {switches.data &&
                switches.data.allSwitches.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.description}</td>
                    <td>{a.commandFile}</td>
                    <td>{convertDate(a.updatedAt / 1000)}</td>
                    <td>{a.id}</td>
                    <td>
                      <Button
                        style={{
                          color: 'red',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          font: 'inherit',
                        }}
                        onClick={() => handleDeleteSwitch(a.id)}
                      >
                        poista
                      </Button>
                    </td>
                    <td>
                      <Button
                        style={{
                          color: 'blue',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          font: 'inherit',
                        }}
                        onClick={() => handleUpdateSwitch(a.id)}
                      >
                        päivitä
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Row>

        {displaySwitchForm && (
          <div>
            <Row className="align-items-end">
              <Col className="col-2">
                <Form>
                  <Form.Group>
                    <Form.Label>Nimi</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={({ target }) => setName(target.value)}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col className="col-3">
                <Form>
                  <Form.Group>
                    <Form.Label>Kuvaus</Form.Label>
                    <Form.Control
                      type="text"
                      value={description}
                      onChange={({ target }) => setDescription(target.value)}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col className="col-3">
                <Form>
                  <Form.Group>
                    <Form.Label>Komentotiedosto</Form.Label>
                    <Form.Control
                      type="text"
                      value={commandFile}
                      onChange={({ target }) => setCommandFile(target.value)}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col className="col-2">
                <Button onClick={handleSubmitSwitch}>päivitä/lisää</Button>
              </Col>
              <Col className="col-2">
                <Button onClick={closeSwitchForm}>peruuta</Button>
              </Col>
            </Row>
          </div>
        )}
        {!displaySwitchForm && (
          <Button onClick={() => handleNewSwitch()}>Lisää uusi</Button>
        )}
        <Row className="p-4" style={{ color: 'red' }}>
          {errorMessage}
        </Row>
      </Col>
    </Row>
  )
}

export default Switches