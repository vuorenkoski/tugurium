const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Image extends Model {}

Image.init(
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
    image: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'image',
  }
)

module.exports = Image