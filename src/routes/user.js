const express = require('express')
const router = express.Router()
const UserController = require('../controllers/C_Users')
const auth = require('../middleware/Auth')
const upload = require('../middleware/multer')

router

.get('/', auth.verifyAccess, UserController.getAllUser)
.get('/:idUser', UserController.getCurrentUser)
.patch('/:idUser', upload.single('avatar'), auth.verifyAccess, UserController.updateProfile)
.patch('/phonenumber/:idUser', UserController.updatePhone)
.delete('/:idUser', UserController.deleteUser)
// .patch('/avatar/:id', upload.single('avatar'), UserController.updateAvatar)
module.exports = router