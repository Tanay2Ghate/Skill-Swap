const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Production (Render Postgres / Neon / Supabase)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Local Development (SQLite)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './skillswap.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
}

module.exports = sequelize;
