const express = require('express')
const router = express.Router()
const authController = require('../controllers/C_Auth')

router

.post('/login', authController.Login)
.post('/register', authController.Register)

.get('/verification/:token', authController.Activation)
module.exports = router