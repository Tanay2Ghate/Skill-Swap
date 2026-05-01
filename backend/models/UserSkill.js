const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserSkill = sequelize.define('UserSkill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  proficiency: {
    type: DataTypes.STRING,
    defaultValue: 'beginner'
  }
}, {
  tableName: 'user_skills',
  timestamps: false,
  indexes: []
});

module.exports = UserSkill;
