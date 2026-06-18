const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('tags');
      try {
        return rawValue ? JSON.parse(rawValue) : [];
      } catch (e) {
        return [];
      }
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  },
  githubUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  liveUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
});

module.exports = Project;
