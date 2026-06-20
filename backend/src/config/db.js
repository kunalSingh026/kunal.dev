const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Determine database file path (allow env override for persistence on Render)
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'data', 'portfolio.sqlite');

// Ensure the data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Disable console SQL logging for clean server output
  define: {
    timestamps: true,
  }
});

module.exports = sequelize;
