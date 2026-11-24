const router = require('express').Router();
const protect = require('../middlewares/authMiddlewares');
const { createSwap, getMySwaps, getSwap, updateStatus, addResource } = require('../controllers/swapController');

router.post('/', protect, createSwap);
router.get('/', protect, getMySwaps);
router.get('/:id', protect, getSwap);
router.patch('/:id/status', protect, updateStatus);
router.post('/:id/resources', protect, addResource);

module.exports = router;
