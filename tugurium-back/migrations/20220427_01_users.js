const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: { args: [3, 10], msg: 'Username must be 3-10 characters long' },
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users')
  },
}
