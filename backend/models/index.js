const sequelize = require('../config/database');
const User = require('./User');
const Skill = require('./Skill');
const UserSkill = require('./UserSkill');
const SwapRequest = require('./SwapRequest');
const Message = require('./Message');
const Session = require('./Session');
const Rating = require('./Rating');
const Notification = require('./Notification');

// User associations
User.hasMany(UserSkill, { foreignKey: 'user_id', as: 'userSkills', onDelete: 'CASCADE' });

// Skill associations
Skill.hasMany(UserSkill, { foreignKey: 'skill_id' });

// UserSkill associations
UserSkill.belongsTo(User, { foreignKey: 'user_id' });
UserSkill.belongsTo(Skill, { foreignKey: 'skill_id', as: 'skill' });

// SwapRequest associations
SwapRequest.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
SwapRequest.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
SwapRequest.belongsTo(Skill, { foreignKey: 'skill_offered_id', as: 'skillOffered' });
SwapRequest.belongsTo(Skill, { foreignKey: 'skill_wanted_id', as: 'skillWanted' });
SwapRequest.hasMany(Message, { foreignKey: 'swap_id', as: 'messages', onDelete: 'CASCADE' });
SwapRequest.hasOne(Session, { foreignKey: 'swap_id', as: 'session' });

// Message associations
Message.belongsTo(SwapRequest, { foreignKey: 'swap_id' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Session associations
Session.belongsTo(SwapRequest, { foreignKey: 'swap_id' });
Session.belongsTo(User, { foreignKey: 'proposed_by', as: 'proposedBy' });
Session.hasMany(Rating, { foreignKey: 'session_id', as: 'ratings' });

// Rating associations
Rating.belongsTo(Session, { foreignKey: 'session_id' });
Rating.belongsTo(User, { foreignKey: 'rater_id', as: 'rater' });
Rating.belongsTo(User, { foreignKey: 'ratee_id', as: 'ratee' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  User,
  Skill,
  UserSkill,
  SwapRequest,
  Message,
  Session,
  Rating,
  Notification
};
