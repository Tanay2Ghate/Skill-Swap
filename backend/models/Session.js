const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  swap_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  proposed_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  platform: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  meeting_link: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Session;
