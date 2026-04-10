const express = require('express');
const { loginEmail } = require('../controllers/authController');
const router = express.Router();

// Quick Email Login for Demo
router.post('/login-email', loginEmail);

module.exports = router;
