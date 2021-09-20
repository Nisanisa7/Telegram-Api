const express = require('express')
const router = express.Router()
// const messageRouter = require('../models/M_message')
const messageController = require('../controllers/C_Message')
const Auth = require('../middleware/Auth')
router

    .get('/:idReceiver', Auth.verifyAccess, messageController.getMessageById)

module.exports = router