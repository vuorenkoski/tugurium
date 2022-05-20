import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'

import { useQuery } from '@apollo/client'
import { ALL_IMAGES } from '../queries'
import { convertDate } from '../util/conversions'
import ShowImage from './ShowImage'
const { BACKEND_URL } = require('../util/config')

const ImagesView = () => {
  const [images, setImages] = useState(null)
  const [showImage, setShowImage] = useState(null)

  const image_names = useQuery(ALL_IMAGES, {
    fetchPolicy: 'network-only',
  })

  const fetchImages = async () => {
    const headers = {
      method: 'GET',
      headers: {
        Authorization: 'BEARER ' + localStorage.getItem('tempview-user-token'),
      },
    }
    if (image_names.data) {
      let promises = image_names.data.allImages.map(async (image) => {
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
  }, [image_names]) // eslint-disable-line

  return (
    <div>
      {showImage && <ShowImage image={showImage} setShowImage={setShowImage} />}
      <Row className="p-4">
        <Col>
          <h2>Kamerat</h2>
        </Col>
      </Row>
      <Row>
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
