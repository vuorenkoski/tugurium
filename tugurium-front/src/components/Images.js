import { Table, Row, Col, Form, Button } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  ALL_IMAGES,
  DELETE_IMAGE,
  UPDATE_IMAGE,
  NEW_IMAGE,
} from '../graphql/image'
import { convertDate } from '../util/conversions'

const Images = () => {
  const [displayImageForm, setDisplayImageForm] = useState(false)
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [description, setDescription] = useState('')
  const [imageId, setImageId] = useState(-1)
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

  const handleDeleteImage = (id) => {
    const variables = { deleteImageId: Number(id) }
    deleteImage({ variables })
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

  const handleSubmitImage = async (event) => {
    event.preventDefault()
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
                <th>Id</th>
                <th></th>
                <th></th>
              </tr>
              {images.data &&
                images.data.allImages.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.description}</td>
                    <td>{convertDate(a.updatedAt / 1000)}</td>
                    <td>{a.id}</td>
                    <td>
                      <button
                        className="removeButton"
                        onClick={() => handleDeleteImage(a.id)}
                      >
                        poista
                      </button>
                    </td>
                    <td>
                      <button
                        className="updateButton"
                        onClick={() => handleUpdateImage(a.id)}
                      >
                        päivitä
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {!displayImageForm && (
        <Row className="p-4 pt-1 pb-1">
          <Col>
            <Button onClick={() => handleNewImage()}>Lisää uusi</Button>
          </Col>
        </Row>
      )}

      {displayImageForm && (
        <Row className="p-4 pt-1 pb-1 align-items-end">
          <Col className="col-auto">
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
          <Col className="col-auto">
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
          <Col className="col-auto">
            <Button onClick={handleSubmitImage}>päivitä/lisää</Button>
          </Col>
          <Col className="col-auto">
            <Button onClick={closeImageForm}>peruuta</Button>
          </Col>
        </Row>
      )}
      <Row className="p-4">
        <Col className="errorMessage">{errorMessage}</Col>
      </Row>
    </div>
  )
}

export default Images
