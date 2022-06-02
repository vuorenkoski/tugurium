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
        len: { args: [4, 4], msg: 'Name must have four characters' },
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
    lastValue: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    lastTimestamp: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
