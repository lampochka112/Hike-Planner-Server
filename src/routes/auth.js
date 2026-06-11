const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../validators/authValidators');

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', auth, authController.getMe);
router.put('/me', auth, authController.updateProfile);

module.exports = router;
