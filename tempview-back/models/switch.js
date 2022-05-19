const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Switch extends Model {}

Switch.init(
  {
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
    commandFile: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'switch',
  }
)

module.exports = Switch
