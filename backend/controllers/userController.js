const { User, UserSkill, Skill, Rating } = require('../models');

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash', 'otp', 'otp_expires', 'refresh_token'] },
      include: [
        {
          model: UserSkill,
          as: 'userSkills',
          include: [{ model: Skill, as: 'skill' }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (name) user.name = name;
    if (bio) user.bio = bio;
    
    await user.save();
    
    res.status(200).json({ success: true, user: { id: user.id, name: user.name, bio: user.bio, avatar_url: user.avatar_url } });
  } catch (error) {
    next(error);
  }
};

exports.addSkill = async (req, res, next) => {
  try {
    const { skill_id, type, proficiency } = req.body;
    
    if (!skill_id || !type) {
      return res.status(400).json({ success: false, message: 'skill_id and type are required' });
    }

    // Check if skill exists
    const skillExists = await Skill.findByPk(skill_id);
    if (!skillExists) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Upsert equivalent for UserSkill
    let userSkill = await UserSkill.findOne({
      where: { user_id: req.user.id, skill_id, type }
    });

    if (userSkill) {
      userSkill.proficiency = proficiency || 'beginner';
      await userSkill.save();
    } else {
      userSkill = await UserSkill.create({
        user_id: req.user.id,
        skill_id,
        type,
        proficiency: proficiency || 'beginner'
      });
    }

    res.status(200).json({ success: true, userSkill });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'You cannot both have and want the exact same skill.' });
    }
    next(error);
  }
};

exports.removeSkill = async (req, res, next) => {
  try {
    const { skillId, type } = req.params;
    
    await UserSkill.destroy({
      where: { user_id: req.user.id, skill_id: skillId, type }
    });

    res.status(200).json({ success: true, message: 'Skill removed' });
  } catch (error) {
    next(error);
  }
};
