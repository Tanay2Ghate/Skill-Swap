const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const auth = require('../middleware/auth');

router.post('/', auth, swapController.createSwap);
router.get('/', auth, swapController.getSwaps);
router.put('/:id/accept', auth, swapController.acceptSwap);
router.put('/:id/reject', auth, swapController.rejectSwap);

module.exports = router;
