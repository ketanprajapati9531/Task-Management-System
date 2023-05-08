const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define(
  // model
  'User',
  {
    // objects
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    // options
    timestamps: true,
    underscored: true,
  }
);



//User.hasMany(Todo, { foreignKey: 'user.id' });

module.exports = User;
