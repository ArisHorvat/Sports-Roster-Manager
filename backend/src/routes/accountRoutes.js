const express = require('express');
const AccountController = require('../controllers/accountController');

const router = express.Router();

router.post('/', AccountController.createAccount);
router.post('/login', AccountController.login);

module.exports = router;
