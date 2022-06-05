import { Modal, Button, Row, Col, Container } from 'react-bootstrap'
import { convertDate } from '../util/conversions'

const ShowImage = ({ image, setShowImage }) => {
  return (
    <Modal show={true} onHide={() => setShowImage(null)} fullscreen={true}>
      <Modal.Body>
        <Container>
          <Row>
            <h2>
              {image.description}: {convertDate(image.updatedAt / 1000)}
            </h2>
          </Row>
          <Row>
            <Col className="col-auto p-4">
              {image && (
                <img
                  className="fullscreenImage"
                  src={image.data}
                  alt={image.name}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={() => setShowImage(null)}>takaisin</Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  )
}

export default ShowImage
