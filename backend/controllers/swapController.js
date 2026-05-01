const { SwapRequest, User, Skill } = require('../models');
const { Op } = require('sequelize');

exports.createSwap = async (req, res, next) => {
  try {
    const { receiver_id, skill_offered_id, skill_wanted_id } = req.body;
    
    // Simplistic check
    if (!receiver_id || !skill_offered_id || !skill_wanted_id) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    if (receiver_id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot swap with yourself' });
    }

    const swap = await SwapRequest.create({
      sender_id: req.user.id,
      receiver_id,
      skill_offered_id,
      skill_wanted_id,
      status: 'accepted' // AUTO ACCEPT FOR DEMO PURPOSES
    });

    res.status(201).json({ success: true, swap });
  } catch (error) {
    next(error);
  }
};

exports.getSwaps = async (req, res, next) => {
  try {
    const { filter } = req.query; // 'incoming', 'outgoing', 'active', 'all'
    
    let where = {};
    if (filter === 'incoming') {
      where = { receiver_id: req.user.id, status: 'pending' };
    } else if (filter === 'outgoing') {
      where = { sender_id: req.user.id, status: 'pending' };
    } else if (filter === 'active') {
      where = { 
        [Op.or]: [{ sender_id: req.user.id }, { receiver_id: req.user.id }],
        status: 'accepted'
      };
    } else {
      where = { [Op.or]: [{ sender_id: req.user.id }, { receiver_id: req.user.id }] };
    }

    const swaps = await SwapRequest.findAll({
      where,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar_url'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar_url'] },
        { model: Skill, as: 'skillOffered' },
        { model: Skill, as: 'skillWanted' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(swaps);
  } catch (error) {
    next(error);
  }
};

exports.acceptSwap = async (req, res, next) => {
  try {
    const swap = await SwapRequest.findByPk(req.params.id);
    if (!swap || swap.receiver_id !== req.user.id) return res.status(404).json({ success: false, message: 'Not found' });
    
    swap.status = 'accepted';
    await swap.save();
    res.status(200).json({ success: true, swap });
  } catch (error) {
    next(error);
  }
};

exports.rejectSwap = async (req, res, next) => {
  try {
    const swap = await SwapRequest.findByPk(req.params.id);
    if (!swap || swap.receiver_id !== req.user.id) return res.status(404).json({ success: false, message: 'Not found' });
    
    swap.status = 'rejected';
    await swap.save();
    res.status(200).json({ success: true, swap });
  } catch (error) {
    next(error);
  }
};
