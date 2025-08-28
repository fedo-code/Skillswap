const router = require('express').Router();
const { findMatches } = require('../controllers/matchController');
const protect = require('../middlewares/authMiddlewares');

router.get('/', protect, findMatches);

module.exports = router;
