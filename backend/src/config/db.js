const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

let sequelize;

if (process.env.DATABASE_URL) {
  // Production PostgreSQL (e.g. Neon or Supabase)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for hosted PostgreSQL services like Neon/Supabase
      }
    },
    logging: false,
    define: {
      timestamps: true,
    }
  });
} else {
  // Local Development SQLite
  const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'data', 'portfolio.sqlite');
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
    define: {
      timestamps: true,
    }
  });
}

module.exports = sequelize;
