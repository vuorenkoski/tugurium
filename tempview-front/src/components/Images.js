import { Table, Row, Col, Form, Button } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  ALL_IMAGES,
  DELETE_IMAGE,
  UPDATE_IMAGE,
  NEW_IMAGE,
} from '../queries'
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
      setErrorMessage(error.graphQLErrors[0])
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

  const handeDeleteImage = (id) => {
    const variables = { deleteImageId: Number(id) }
    deleteImage({ variables })
  }

  const handeUpdateImage = (id) => {
    setDisplayImageForm(true)
    const image = images.data.allImages.filter((s) => s.id === id)[0]
    setName(image.name)
    setDescription(image.description)
    setImageId(Number(image.id))
  }

  const handeNewImage = (id) => {
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
    <Row className="p-4 pb-0">
      <h2>Kamerat</h2>
      <Col className="col-8">
        <Row>
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
                    <td>{convertDate(a.updatedAt/1000)}</td>
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
                        onClick={() => handeDeleteImage(a.id)}
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
                        onClick={() => handeUpdateImage(a.id)}
                      >
                        päivitä
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Row>

        {displayImageForm && (
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
              <Col className="col-4">
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
              <Col className="col-2">
                <Button onClick={handleSubmitImage}>päivitä/lisää</Button>
              </Col>
              <Col className="col-2">
                <Button onClick={closeImageForm}>peruuta</Button>
              </Col>
            </Row>
          </div>
        )}
        {!displayImageForm && (
          <Button onClick={() => handeNewImage()}>Lisää uusi</Button>
        )}
        <Row className="p-4" style={{ color: 'red' }}>
          {errorMessage}
        </Row>
      </Col>
    </Row>
  )
}

export default Images
