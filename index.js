require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const route = require('./src/routes/index')
const PORT = process.env.PORT
const morgan = require('morgan')
const setCors = require('./src/middleware/cors')
const cors = require('cors')
const http = require("http")
const httpServer = http.createServer(app)
const socket = require('socket.io')
const jwt = require('jsonwebtoken')
const modelMessage = require('./src/models/M_message')
const moment = require('moment');

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(morgan('dev'))
//my middleware
const myMiddleware = (req, res, next) => {
    console.log('my middleware di jalankan ');
    next()
  }
  
  app.use(myMiddleware)
  app.use(cors())
//   app.use(setCors) 
app.use('/v1', route)

// static route for image
app.use('/file', express.static('./uploads'))

// config socket
const io = socket(httpServer, {
  cors: {
    origin: '*'
  }
})

io.use((socket, next)=>{
  const token = socket.handshake.query.token;
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        const error = new Error('token expired')
        error.status = 401
        return next(error)
      } else if (err.name === 'JsonWebTokenError') {
        const error = new Error('token invalid')
        error.status = 401
        return next(error)
      } else {
        const error = new Error('token not active')
        error.status = 401
        return next(error)
      }

    }
    socket.userId = decoded.idUser
    socket.join(`user:${decoded.idUser}`)
    // console.log(decoded.id);
    next()
  })

    // req.idUser = decoded.idUser
    // next()
 
})


// // use socket
io.on('connection', (socket)=>{
  console.log("theres's client connected ", socket.userId);

  
  socket.on('sendChat', ({idReceiver, messageBody}, callback)=>{
    const dataMessage = {
      sender_id: socket.userId,
      receiver_id: idReceiver,
      message: messageBody,
      createdAt: new Date()
    }
    console.log(dataMessage);
    callback({
      ...dataMessage,
      createdAt: dataMessage.createdAt
      
    })
    //save to database
    modelMessage.insertMessage(dataMessage)
    .then(()=>{
      console.log('success');
      //this is for live message
      socket.broadcast.to(`user:${idReceiver}`).emit('sendChatFromBackend', {
        ...dataMessage,
        createdAt: dataMessage.createdAt
      })
    })
  })
  socket.on('disconnect', ()=>{
    console.log("client disconnected");
  })
  
})

app.use('*', (req, res)=>{
    res.status(404).json({
        message: 'url not found'
    })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    message: err.message || 'internal server Error'
  })
})

httpServer.listen(4000, ()=>{
    console.log('server is runnig port' + 4000);
  })

