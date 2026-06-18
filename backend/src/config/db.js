const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'portfolio.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Disable console SQL logging for clean server output
  define: {
    timestamps: true,
  }
});

module.exports = sequelize;
