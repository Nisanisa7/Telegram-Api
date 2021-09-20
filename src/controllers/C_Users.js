const userModel = require("../models/M_users");
const helpers = require("../helpers/helpers");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require('fs')

const getAllUser = (req, res)=>{
    const page = parseInt(req.query.page) 
    console.log(req.idUser);
    const search = req.query.search || ''
    const sortBy = req.query.sortBy || 'idUser'
    const sort = req.query.sort|| 'ASC'
    const limit = parseInt(req.query.limit)||10
    const offset = page ? page * limit :0;
    // console.log(idUser);
    userModel.getAllUser(search, sortBy, sort, offset, limit, req.idUser)
    .then((result)=>{
        const users = result
        const totalpages = Math.ceil(users.count/limit);
        // const friends = users.filter((item)=>{
        //     if(item.idUser != req.idUser){
        //       return item
        //     }
        // })
        // console.log('ini log friends', friends);
        res.status(200)
        res.json({
            "message": 'success',
            "totalpages": totalpages,
            "limit": limit,
            "currentpageNumber": page,
            "currentpageSize" : result.length,
            "totalItems" : result.count,
            item: users,

        })
    })
    .catch((error)=>{
        console.log(error);
        helpers.response(res, null, 500, {message: 'internal server error'})
    })
}

const updateProfile = async (req, res, next) =>{
    const idUser = req.params.idUser
    console.log(idUser);
    const {name, status_bio, phone_number} = req.body
    const data = {
        name : name,
        status_bio : status_bio,
        avatar : `${process.env.BASE_URL}/file/`+ req.file.filename,
        phone_number : phone_number
    }
    console.log(data);
    userModel.updateUser(idUser, data)
    .then(()=>{
        helpers.response(res, data, 200, {message: "Data Successfully Updated"})
    })
    .catch((error)=>{
        console.log(error);
        res.status(500)
        res.json({
            message:'internal server error'
        })
    })
}

const insertProfile = (req, res, next) =>{
    const idUser = req.params.idUser
    const {name, phone_number, status_bio} = req.body
    const data = {
        name : name,
        phone_number : phone_number,
        status_bio : status_bio,
        avatar : `${process.env.BASE_URL}/file/`+ req.file.filename,
    }
    userModel.updateUser(data, idUser)
    .then(()=>{
        helpers.response(res, data, 200, {message: "Data Successfully Inserted"})
    })
    .catch((error)=>{
        console.log(error);
        helpers.response(res, null, 500, {message: 'internal server error'})
        fs.unlink(
            `./uploads/${req.file.filename}`, (err =>{
                if(err){
                    console.log(err);
                }
            })
        )
    })
}

const updatePhone = (req, res, next) =>{
    const idUser = req.params.idUser
    const {phone_number} = req.body
    const data = {
        phone_number : phone_number,
    }
    console.log(data);
    userModel.updatePhone(data, idUser)
    .then(()=>{
        helpers.response(res, data, 200, {message: "Data Successfully updated"})
    })
    .catch((error)=>{
        console.log(error);
        helpers.response(res, null, 500, {message: 'internal server error'})
    })
}

const deleteUser = (req, res, next) =>{
    const idUser = req.params.idUser
    userModel.deleteUser(idUser)
    .then(()=>{
        helpers.response(res, idUser, 200, {message: "Data Successfully deleted"})
    })
    .catch((err)=>{
        console.log(err);
        helpers.response(res, null, 500, {message: 'internal server error'})
    })
}

const getCurrentUser = (req, res, next) =>{
    const idUser = req.params.idUser
    userModel.getCurrentUser(idUser)
    .then((result)=>{
        const user = result
        helpers.response(res, user, 200, {message: "success"})
    })
    .catch((err)=>{
        console.log(err);
        helpers.response(res, null, 500, {message: 'internal server error'})
    })
}

// const updateAvatar = async (req, res, next) => {
//    const idUser =  req.params.idUser
// //    const avatar = req.body.avatar
//    const data = {
//        avatar : req.file.filename
//    }
//    userModel.updateUser(idUser, data)
//    .then(()=>{
//     helpers.response(res, data, 200, {message: "Data Successfully Updated"})
//    })
//    .catch((error)=>{
//     console.log(error);
//     res.status(500)
//     res.json({
//         message:'internal server error'
//     })
// })
//   }
module.exports = {
    getAllUser,
    updateProfile,
    insertProfile,
    updatePhone,
    deleteUser,
    getCurrentUser
    // updateAvatar
}