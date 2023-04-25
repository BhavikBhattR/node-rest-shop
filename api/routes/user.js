const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')
const checkAuth = require('../middleware/check-auth')

router.post('/signup', userController.user_POST_signup)

router.post('/login', userController.user_POST_login)

router.delete('/:userID', checkAuth, userController.user_DELETE_account)

module.exports = router;