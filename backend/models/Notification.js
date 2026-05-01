const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('swap_request', 'swap_accepted', 'swap_rejected', 'new_message', 'session_reminder', 'rating_received'),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Notification;
