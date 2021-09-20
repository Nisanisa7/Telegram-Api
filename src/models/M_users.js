const connection = require('../configs/db')

const getAllUser = (search, sortBy, sort,offset, limit, idUser) =>{
    return new Promise((resolve, reject)=>{
        const queryCount = ('SELECT count(*) as numRows FROM users') 
        connection.query(`SELECT * FROM users   WHERE idUser <> '${idUser}' AND username LIKE CONCAT('%',?,'%') ORDER BY ${sortBy} ${sort} LIMIT ?, ?`, [search, offset, limit], (error, result)=>{
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const updateUser= (idUser, data)=>{
    return new Promise((resolve, reject)=>{
        connection.query('UPDATE users SET ? WHERE idUser = ?', [data, idUser], (error, result)=>{
            if(!error){
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const insertProfile = (data, idUser)=>{
    return new Promise((resolve, reject)=>{
        connection.query(`UPDATE users SET ?`, [data, idUser], (error, result)=>{
            if(!error){
                resolve(result)
            } else{
                reject(error)
            }
        })
    })
}

const updatePhone = (data, idUser)=>{
        return new Promise((resolve, reject)=>{
        connection.query(`UPDATE users SET ? WHERE idUser = ?`, [data, idUser], (error, result)=>{
            if(!error){
                resolve(result)
            } else{
                reject(error)
            }
        })
    })
}

const deleteUser = (idUser)=>{
    return new Promise((resolve, reject)=>{
        connection.query('DELETE FROM users where idUser = ?', idUser, (error, result)=>{
            if (!error){
                resolve(result)
            } else{
                reject(error)
            }
        })
    })
}

const getCurrentUser = (idUser)=>{
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM users where idUser = ?', idUser, (error, result)=>{
            if (!error){
                resolve(result)
            } else{
                reject(error)
            }
        })
    })
}
module.exports = {
    getAllUser,
    updateUser,
    insertProfile,
    updatePhone,
    deleteUser,
    getCurrentUser
}