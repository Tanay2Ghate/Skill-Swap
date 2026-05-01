const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SwapRequest = sequelize.define('SwapRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  skill_offered_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  skill_wanted_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
    defaultValue: 'pending'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'swap_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SwapRequest;
