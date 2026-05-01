const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const auth = require('../middleware/auth');

router.get('/', auth, matchController.getMatches);

module.exports = router;
