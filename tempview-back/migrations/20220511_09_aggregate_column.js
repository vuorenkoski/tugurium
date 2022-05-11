const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('sensors', 'agrmethod', {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'AVG',
      validate: {
        isIn: [['SUM', 'AVG']],
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('agrmethod')
  },
}
