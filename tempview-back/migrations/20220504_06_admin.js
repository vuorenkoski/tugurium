const bcrypt = require('bcrypt')
const { ADMIN_PASSWORD } = require('../util/config')

module.exports = {
  up: async ({ context: queryInterface }) => {
    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password_hash,
        admin: true,
      },
    ])
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.bulkDelete('users', null, {})
  },
}
