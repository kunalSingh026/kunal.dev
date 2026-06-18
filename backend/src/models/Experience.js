const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
});

module.exports = Experience;
