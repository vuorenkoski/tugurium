import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
const { BACKEND_URL } = require('../util/config')

const Commands = ({ token }) => {
  const [img1, setImg1] = useState()
  const [img2, setImg2] = useState()
  const [img3, setImg3] = useState()

  const fetchImage = async () => {
    const headers = {
      method: 'GET',
      headers: {
        Authorization: 'BEARER ' + localStorage.getItem('tempview-user-token'),
      },
    }

    let res = await fetch(BACKEND_URL + '/image/1', headers)
    let imageBlob = await res.blob()
    let imageObjectURL = URL.createObjectURL(imageBlob)
    setImg1(imageObjectURL)

    res = await fetch(BACKEND_URL + '/image/2', headers)
    imageBlob = await res.blob()
    imageObjectURL = URL.createObjectURL(imageBlob)
    setImg2(imageObjectURL)

    res = await fetch(BACKEND_URL + '/image/3', headers)
    imageObjectURL = URL.createObjectURL(await res.blob())
    setImg3(imageObjectURL)
  }

  useEffect(() => {
    fetchImage()
  }, [])

  return (
    <div>
      <Row className="p-4">
        <h2>Kuvat</h2>
        <Col className="col-6">
          <img src={img1} alt="kuva1" height={400} />
        </Col>
        <Col className="col-6">
          <img src={img2} alt="kuva2" height={400} />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="col-8">
          <img src={img3} alt="kuva3" height={400} />
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
