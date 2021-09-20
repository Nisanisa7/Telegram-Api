const connection = require('../configs/db')

const findUser = (email)=>{
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM users where email = ?', email, (error, result)=>{
            if(!error){
                resolve(result)
            } else{
                reject(error)
            }
        })
    })
}

const Register = (data)=>{
    return new Promise((resolve, reject)=>{
        connection.query('INSERT INTO users SET ?', data, (error, result)=>{
            if(!error){
                resolve(result)
            } else{
                reject(error)
            }
        })
    })
}

const updateStatus = (email) =>{
    return new Promise((resolve, reject)=>{
        connection.query(`UPDATE users SET status = 'Active' where email = ?`, email, (error, result)=>{
            if(!error){
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}


module.exports ={
    findUser,
    Register,
    updateStatus
}