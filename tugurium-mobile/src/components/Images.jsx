import { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import { useQuery } from '@apollo/client'

import Text from './Text'
import { ALL_IMAGES } from '../graphql/image'
import useAuthStorage from '../hooks/useAuthStorage'
import { convertDate } from '../utils/conversions'
import ShowImage from './ShowImage'

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    paddingBottom: 0,
  },
  imageListStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  imageTitle: {
    padding: 20,
    paddingBottom: 5,
  },
  image: {
    width: 300,
    height: 200,
  },
})

const readFileAsDataURL = async (file) => {
  const result_base64 = await new Promise((resolve) => {
    let fileReader = new FileReader()
    fileReader.onload = () => resolve(fileReader.result)
    fileReader.readAsDataURL(file)
  })
  return result_base64
}

const Images = () => {
  const [images, setImages] = useState([])
  const [showImage, setShowImage] = useState(null)
  const authStorage = useAuthStorage()

  const imageNames = useQuery(ALL_IMAGES, {
    fetchPolicy: 'network-only',
  })

  const fetchImages = async () => {
    const token = await authStorage.getAccessToken()
    const host = await authStorage.getHost()
    const headers = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${token}`,
      },
    }
    if (imageNames.data) {
      let promises = imageNames.data.allImages.map(async (image) => {
        const res = await fetch(
          `https://${host}/api/image/${image.name}`,
          headers
        )
        let imageObjectURL = null
        if (res.status === 200) {
          const content = await res.blob()
          imageObjectURL = await readFileAsDataURL(content)
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
  }, [imageNames])

  return (
    <>
      {showImage && <ShowImage image={showImage} setShowImage={setShowImage} />}
      <ScrollView>
        <View style={styles.labelRow}>
          <Text textType="heading1">Kamerat</Text>
        </View>
        {!imageNames.data && imageNames.loading && (
          <View style={styles.row}>
            <Text textType="loading">Ladataan dataa palvelimelta...</Text>
          </View>
        )}
        {!imageNames.data && imageNames.error && imageNames.error.networkError && (
          <View style={styles.row}>
            <Text textType="error">
              Verkkovirhe (backend ei tavoitettavissa?)
            </Text>
          </View>
        )}
        <View style={styles.imageListStyle}>
          {images &&
            images.map((im) => (
              <View key={im.name} style={styles.imageContainer}>
                <Text textType="primaryText" style={styles.imageTitle}>
                  {im.description}: {convertDate(im.updatedAt / 1000)}
                </Text>
                {im.data && (
                  <Pressable
                    onPress={() => {
                      setShowImage(im)
                    }}
                  >
                    <Image
                      style={styles.image}
                      resizeMode={'contain'}
                      source={{ uri: im.data }}
                    />
                  </Pressable>
                )}
                {!im.data && <Text>Ei kuvaa</Text>}
              </View>
            ))}
        </View>
      </ScrollView>
    </>
  )
}

export default Images
