import { Modal, Button } from 'react-bootstrap'
import { convertDate } from '../util/conversions'

const ShowImage = ({ image, setShowImage }) => {
  return (
    <Modal show={true} onHide={() => setShowImage(null)} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title>
          {image.description}: {convertDate(image.updatedAt / 1000)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {image && <img src={image.data} alt={image.name} />}
        <br />
        <br />
        <Button onClick={() => setShowImage(null)}>takaisin</Button>
      </Modal.Body>
    </Modal>
  )
}

export default ShowImage
