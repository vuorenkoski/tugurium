const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Sensor extends Model {}

Sensor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sensorName: {
      type: DataTypes.TEXT,
      unique: true,
      validate: {
        len: [4, 4],
      },
    },
    sensorFullname: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sensorUnit: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'sensor',
  }
)

module.exports = Sensor
