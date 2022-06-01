import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'

import { useQuery } from '@apollo/client'
import { ALL_IMAGES } from '../graphql/image'
import { convertDate } from '../util/conversions'
import ShowImage from './ShowImage'
const { BACKEND_URL } = require('../util/config')

const ImagesView = () => {
  const [images, setImages] = useState([])
  const [showImage, setShowImage] = useState(null)

  const imageNames = useQuery(ALL_IMAGES, {
    fetchPolicy: 'network-only',
  })

  const fetchImages = async () => {
    const headers = {
      method: 'GET',
      headers: {
        Authorization: 'BEARER ' + localStorage.getItem('tugurium-user-token'),
      },
    }
    if (imageNames.data) {
      let promises = imageNames.data.allImages.map(async (image) => {
        const res = await fetch(BACKEND_URL + '/image/' + image.name, headers)
        let imageObjectURL = null
        if (res.status === 200) {
          const imageBlob = await res.blob()
          imageObjectURL = URL.createObjectURL(imageBlob)
        }
        return {
          name: image.name,
          description: image.description,
          updatedAt: image.updatedAt,
          data: imageObjectURL,
        }
      })
      Promise.all(promises).then(function (result) {
        setImages(result)
      })
    }
  }

  useEffect(() => {
    fetchImages()
  }, [imageNames]) // eslint-disable-line

  return (
    <div>
      {showImage && <ShowImage image={showImage} setShowImage={setShowImage} />}
      <Row className="p-4 pb-0">
        <Col>
          <h2>Kamerat</h2>
        </Col>
      </Row>
      {!imageNames.data && imageNames.loading && (
        <Row className="p-4 pb-0">
          <Col>
            <p>Ladataan dataa palvelimelta...</p>
          </Col>
        </Row>
      )}
      {!imageNames.data && imageNames.error && imageNames.error.networkError && (
        <Row className="p-4 pb-0">
          <Col>
            <p className="errorMessage">
              Virhe: Verkkovirhe (backend ei tavoitettavissa?)
            </p>
          </Col>
        </Row>
      )}
      <Row className="p-4 pb-0">
        {images &&
          images.map((im) => (
            <Col key={im.name} className="col-auto p-4">
              {im.data && (
                <img
                  src={im.data}
                  alt={im.description}
                  height={400}
                  onClick={() => setShowImage(im)}
                />
              )}
              {!im.data && <p>Ei kuvaa</p>}
              <p>
                {im.description}: {convertDate(im.updatedAt / 1000)}
              </p>
            </Col>
          ))}
      </Row>
    </div>
  )
}

export default ImagesView
