import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'

import { useQuery } from '@apollo/client'
import { ALL_IMAGES } from '../queries'
import { convertDate } from '../util/conversions'

const { BACKEND_URL } = require('../util/config')

const Commands = ({ token }) => {
  const [images, setImages] = useState(null)
  const image_names = useQuery(ALL_IMAGES, {
    fetchPolicy: 'network-only',
  })

  const fetchImage = async () => {
    const headers = {
      method: 'GET',
      headers: {
        Authorization: 'BEARER ' + localStorage.getItem('tempview-user-token'),
      },
    }
    if (image_names.data) {
      let promises = image_names.data.allImages.map(async (image) => {
        const res = await fetch(BACKEND_URL + '/image/'+image.name, headers)
        let imageObjectURL = null
        if (res.status===200) {
          const imageBlob = await res.blob()
          imageObjectURL = URL.createObjectURL(imageBlob)
        }
        return { name:image.name, description:image.description, updatedAt: image.updatedAt, data:imageObjectURL }
      })
      Promise.all(promises).then(function(result) {
        setImages(result)
      })
    }
  }

  useEffect(() => {
    fetchImage()
  }, [image_names])

  return (
    <div>
      <Row className="p-4">
        <h2>Kuvat</h2>
        { images && images.map((im) => (
          <Col key={im.name} className="col-6">
            { im.data && (<img src={im.data} alt={im.description} height={400} />)}
            { !im.data && (<p>Ei kuvaa</p>)}
            <p>{im.description}: {convertDate(im.updatedAt/1000)}</p>
          </Col>
        ))}
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
