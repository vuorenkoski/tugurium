const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sensors', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sensor_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 4],
        },
      },
      sensor_fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sensor_unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    })
    await queryInterface.createTable('measurements', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    })
    await queryInterface.addColumn('measurements', 'sensor_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'sensors', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sensors')
    await queryInterface.dropTable('measurements')
  },
}
