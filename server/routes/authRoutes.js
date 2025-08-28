const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
console.log('register:', register, 'login:', login);

router.post('/register', register);
router.post('/login', login);

module.exports = router;