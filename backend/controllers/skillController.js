const { Skill } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getSkills = async (req, res, next) => {
  try {
    const { search, category, limit = 50 } = req.query;
    
    let where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (category) {
      where.category = category;
    }

    const skills = await Skill.findAll({
      where,
      limit: parseInt(limit),
      order: [['name', 'ASC']]
    });

    res.status(200).json(skills);
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    // In SQLite, we use DISTINCT differently than MySQL, but Sequelize abstract it
    const categories = await Skill.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      order: [['category', 'ASC']]
    });
    
    res.status(200).json(categories.map(c => c.category));
  } catch (error) {
    next(error);
  }
};
