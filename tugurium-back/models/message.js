const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    from: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
    },
    important: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'message',
  }
)

module.exports = Message
