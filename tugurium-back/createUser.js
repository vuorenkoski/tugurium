const bcrypt = require('bcrypt')
const { User } = require('./models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./util/config')

const main = async () => {
  if (process.argv.length < 4) {
    console.log('usage: node createUser username password')
    return
  }
  const username = process.argv[2]
  const password = process.argv[3]
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.create({ username, passwordHash })

  console.log('Username: ', user.username)
  console.log('PasswordHash: ', user.passwordHash)

  const userForToken = {
    username: user.username,
    id: user.id,
  }
  console.log(userForToken)
  const token = jwt.sign(userForToken, SECRET)
  console.log('Token: ', token)
}

main()
