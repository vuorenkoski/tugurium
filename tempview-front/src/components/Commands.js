import { Row, Col } from 'react-bootstrap'
const { BACKEND_URL } = require('../util/config')

const Commands = () => {
  return (
    <div>
      <Row className="p-4">
        <h2>Kuvat</h2>
        <Col className="col-6">
          <img src={BACKEND_URL + '/image/1'} alt="kuva1" height={400} />
        </Col>
        <Col className="col-6">
          <img src={BACKEND_URL + '/image/2'} alt="kuva2" height={400} />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="col-8">
          <img src={BACKEND_URL + '/image/3'} alt="kuva3" height={400} />
        </Col>
      </Row>
      <Row className="p-4">
        <h2>Aitan lämpöpatteri</h2>
      </Row>
      <Row className="p-4">
        <h2>Kodin valot</h2>
      </Row>
    </div>
  )
}

export default Commands
