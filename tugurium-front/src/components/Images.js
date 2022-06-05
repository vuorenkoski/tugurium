import {
  Table,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  Modal,
  Container,
} from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  ALL_IMAGES,
  DELETE_IMAGE,
  UPDATE_IMAGE,
  NEW_IMAGE,
} from '../graphql/image'
import { convertDate } from '../util/conversions'

const Images = ({ admin }) => {
  const [displayImageForm, setDisplayImageForm] = useState(false)
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [description, setDescription] = useState('')
  const [imageId, setImageId] = useState(-1)
  const [deleteImageId, setDeleteImageId] = useState(null)

  const images = useQuery(ALL_IMAGES)

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    },
    refetchQueries: [{ query: ALL_IMAGES }],
  })

  const [updateImage] = useMutation(UPDATE_IMAGE, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    },
    onCompleted: (data) => {
      closeImageForm()
    },
    refetchQueries: [{ query: ALL_IMAGES }],
  })

  const [newImage] = useMutation(NEW_IMAGE, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
    },
    onCompleted: (data) => {
      closeImageForm()
    },
    refetchQueries: [{ query: ALL_IMAGES }],
  })

  const handleDeleteImage = () => {
    const id = deleteImageId.id
    const variables = { deleteImageId: Number(id) }
    deleteImage({ variables })
    setDeleteImageId(null)
  }

  const handleUpdateImage = (id) => {
    setDisplayImageForm(true)
    const image = images.data.allImages.filter((s) => s.id === id)[0]
    setName(image.name)
    setDescription(image.description)
    setImageId(Number(image.id))
  }

  const handleNewImage = (id) => {
    setDisplayImageForm(true)
    setName('')
    setDescription('')
    setImageId(-1)
  }

  const handleSubmitImage = async () => {
    if (imageId === -1) {
      const variables = { name, description }
      await newImage({ variables })
    } else {
      const variables = {
        name,
        description,
        updateImageId: imageId,
      }
      await updateImage({ variables })
    }
  }

  const closeImageForm = () => {
    setErrorMessage(null)
    setDisplayImageForm(false)
  }

  return (
    <div>
      <Row className="p-4 pb-1">
        <Col>
          <h3>Kamerat</h3>
        </Col>
      </Row>
      <Row className="p-4 pt-1 pb-1">
        <Col className="col-auto">
          <Table striped>
            <tbody>
              <tr>
                <th>Nimi</th>
                <th>Kuvaus</th>
                <th>Päivitetty</th>
                {admin && (
                  <>
                    <th></th>
                    <th></th>
                  </>
                )}
              </tr>
              {images.data &&
                images.data.allImages.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.description}</td>
                    <td>{convertDate(a.updatedAt / 1000)}</td>
                    {admin && (
                      <>
                        <td>
                          <button
                            type="button"
                            className="removeButton"
                            onClick={() => setDeleteImageId(a)}
                          >
                            poista
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="updateButton"
                            onClick={() => handleUpdateImage(a.id)}
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
            <button
              type="button"
              className="addButton"
              onClick={() => handleNewImage()}
            >
              Lisää uusi
            </button>
          </Col>
        </Row>
      )}

      <Modal
        show={deleteImageId}
        onHide={() => setDeleteImageId(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Kameran poistaminen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <h2>{deleteImageId?.description}</h2>
            </Row>
            <Row>
              <p>Oletko varma että haluat poistaa kameran?</p>
            </Row>
            <Row className="p-4">
              <Col className="col-auto">
                <Button onClick={handleDeleteImage}>Poista</Button>
              </Col>
              <Col className="col-auto">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteImageId(null)}
                >
                  Peruuta
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal show={displayImageForm} onHide={closeImageForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kamera</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="nimi"
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="pt-2">
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="kuvaus"
                  value={description}
                  onChange={({ target }) => setDescription(target.value)}
                />
              </InputGroup>
            </Row>
            <Row className="p-4">
              <Col className="col-auto">
                <Button onClick={handleSubmitImage}>
                  {imageId === -1 ? 'Lisää uusi' : 'Päivitä tiedot'}
                </Button>
              </Col>
              <Col className="col-auto">
                <Button variant="secondary" onClick={closeImageForm}>
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

export default Images
