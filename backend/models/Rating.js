const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  session_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rater_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ratee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['session_id', 'rater_id']
    }
  ]
});

module.exports = Rating;
