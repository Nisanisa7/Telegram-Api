const connection = require('../configs/db')
const getMessageId = (idSender, idReceiver)=>{
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM messages where (receiver_id = '${idReceiver}' AND sender_id = '${idSender}') OR (receiver_id = '${idSender}' AND sender_id = '${idReceiver}') ORDER BY createdAt ASC`, (error, result)=>{
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}
const insertMessage = (data) =>{
    return new Promise((resolve, reject)=>{
        connection.query(`INSERT INTO messages SET ?`,data, (error, result)=>{
            if(!error){
                resolve(result)
            } else{
                reject(error)
            }
        })
    })
}
module.exports ={
    getMessageId,
    insertMessage
}