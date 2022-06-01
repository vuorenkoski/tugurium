import { Modal, Pressable, View, Image, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  imageRow: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
})

const ShowImage = ({ image, setShowImage }) => {
  return (
    <Modal show={true} onHide={() => setShowImage(null)} fullscreen={true}>
      <View style={styles.modalContainer}>
        {image && (
          <Pressable onPress={() => setShowImage(null)} style={styles.imageRow}>
            <Image
              style={styles.image}
              resizeMode={'contain'}
              source={{ uri: image.data }}
            />
          </Pressable>
        )}
      </View>
    </Modal>
  )
}

export default ShowImage
