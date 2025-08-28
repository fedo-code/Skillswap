const router = require('express').Router();
const { getUser, updateSkills } = require('../controllers/userController');
const protect = require('../middlewares/authMiddlewares');

router.get('/profile/:id', protect, getUser);        // ✅ Profile fetch
router.patch('/skills/:id', protect, updateSkills);  // ✅ Skills update


module.exports = router;
