const messageModel = require('../models/M_message')
const helpers = require("../helpers/helpers");

const getMessageById = (req, res)=>{
    const idReceiver = req.params.idReceiver
    const idSender = req.idUser
    console.log('idReceiver',idReceiver);
    console.log('idSender',idSender);
    messageModel.getMessageId(idSender, idReceiver)
    .then((result)=>{
        helpers.response(res, result, 200)
    })
    .catch((err)=>{
        console.log(err);
    })
}




module.exports ={
    getMessageById
}