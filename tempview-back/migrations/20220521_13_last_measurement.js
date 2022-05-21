const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('sensors', 'last_value', {
      type: DataTypes.DECIMAL,
      allowNull: true,
    })
    await queryInterface.addColumn('sensors', 'last_timestamp', {
      type: DataTypes.INTEGER,
      allowNull: true,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('last_value')
    await queryInterface.removeColumn('last_timestamp')
  },
}
