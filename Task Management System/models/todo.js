const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require("./user");

const Todo = db.define(
  // model
  'Todo',
  {
    // objects
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    timetaken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    onholded_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    onholded_time : {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    lastonholded_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    
  },
  {
    // options
    timestamps: true,
    underscored: true,
  }
);


Todo.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Todo;

