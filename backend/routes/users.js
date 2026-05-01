const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.post('/me/skills', auth, userController.addSkill);
router.delete('/me/skills/:skillId/:type', auth, userController.removeSkill);

module.exports = router;
