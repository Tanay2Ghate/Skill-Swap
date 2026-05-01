const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  avg_rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  swap_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: true
  },
  otp_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
