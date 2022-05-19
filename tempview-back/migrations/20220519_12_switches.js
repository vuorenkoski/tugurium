const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('switches', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          len: [4, 4],
        },
      },
      description: {
        type: DataTypes.STRING,
      },
      on: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      command: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      command_file: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('switches')
  },
}
