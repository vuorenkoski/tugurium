import AsyncStorage from '@react-native-async-storage/async-storage'

class AuthStorage {
  constructor(namespace = 'tugurium-app') {
    this.namespace = namespace
  }

  async getAccessToken() {
    const token = await AsyncStorage.getItem(`${this.namespace}:accessToken`)
    return token
  }

  async setAccessToken(accessToken) {
    await AsyncStorage.setItem(`${this.namespace}:accessToken`, accessToken)
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(`${this.namespace}:accessToken`)
  }

  async getUser() {
    const user = await AsyncStorage.getItem(`${this.namespace}:user`)
    return user
  }

  async setUser(user) {
    await AsyncStorage.setItem(`${this.namespace}:user`, JSON.stringify(user))
  }

  async removeUser() {
    await AsyncStorage.removeItem(`${this.namespace}:user`)
  }
}

export default AuthStorage
