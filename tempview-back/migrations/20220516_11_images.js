const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('images',   {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.TEXT,
          unique: true,
          validate: {
            len: [4, 4],
          },
        },
        description: {
            type: DataTypes.TEXT,
        },
        image: {
          type: DataTypes.BLOB('long'),
          allowNull: true,
        },
        created_at : {
            type: DataTypes.DATE
          },
        updated_at : {
        type: DataTypes.DATE
        },
      },)
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('images')
  },
}

