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
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [4, 4],
      },
    },
    sensorFullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sensorUnit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agrmethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'AVG',
      validate: {
        isIn: [['SUM', 'AVG']],
      },
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
