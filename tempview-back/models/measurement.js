const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Measurement extends Model {}

Measurement.init(
  {
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
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'measurement',
  }
)

module.exports = Measurement
