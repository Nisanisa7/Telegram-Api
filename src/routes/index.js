const express = require('express')
const route = express.Router()
const authRouter = require('./auth')
const friendsRouter = require('./friends')
const userRouter = require('./user')
const messageRoute = require('./message')
route

    .use('/auth', authRouter)
    .use('/friends', friendsRouter)
    .use('/user', userRouter)
    .use('/messages', messageRoute)

module.exports = route