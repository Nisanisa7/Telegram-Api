const connection = require('../configs/db')
const AuthModel = require('../models/M_Auth')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const helpers = require('../helpers/helpers')
const emailActivation = require('../helpers/emailActivation')

const Login = async (req,res,next)=>{
    const{email, password} = req.body
    const result = await AuthModel.findUser(email)
    const user = result[0]
    if(email == ''|| password == ''){
        helpers.response(res, null, 500, {message: 'Email or Password can not be empty'})
    }
    else if(result < 1){
        return helpers.response(res, null, 500, {message: "We couldn't find an account that matched the one you entered. please try again"})
    }
    bcrypt.compare(password, user.password, function(err, resCompare) {
        if (!resCompare) {      
            return helpers.response(res, null, 401, {message: 'Password wrong'})
        }

        // generate token
        jwt.sign({ email: user.email, idUser: user.idUser, username: user.username},
            process.env.SECRET_KEY, { expiresIn: "24h" },
            function(err, token) {
                console.log(token);
                console.log(process.env.SECRET_KEY);
                delete user.password;
                user.token = token;
                helpers.response(res, user, 200)
            }
        );
    });

}

const Register = async (req, res, next)=>{
    const {username, email, password} = req.body
    const user = await AuthModel.findUser(email)
    if(user.length > 0){
        return helpers.response(res, null, 401, {message:"This email address is already being used"})
    }
    console.log(user);
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password , salt, function(err, hash) {
  
            const data = {
                idUser: uuidv4(),
                username : username,
                email : email,
                password : hash,
                status: 'inactive',
                createdAt : new Date()
                
            }
            AuthModel.Register(data)
            .then((result)=>{
                delete data.password
                jwt.sign({ email: data.email, username: data.username }, process.env.SECRET_KEY, function(err, token) {

                    emailActivation.sendEmail(data.email, data.username, token)
                  });

                helpers.response(res, data , 200, {message: "registered success! check your email for activation "})
              
            })
            .catch((error)=>{
                console.log(error);
                helpers.response(res, null, 500, {message: 'internal server error'})
            })
        });
    });
}

const Activation = (req, res, next)=>{
    const token = req.params.token
    if(token){
        try{

            jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
                if(err) {
                
                    console.log(err);
                    return helpers.response(res, null, 500,{message: 'something went wrong'})
                
                }else{
                    email = decoded.email
                    console.log(email);
                    AuthModel.updateStatus(email)
                    .then(()=>{
                        // helpers.response(res, null, 200, {message: "Your account has been successfully verified"})
                        res.redirect('http://localhost:3000/success')
                    })
                    .catch((err)=>{
                        console.log(err);
                        return helpers.response(res, null, 500, {message: "there's something wrong.."})
                    })
                }   
                 
              });
        } catch (err) {
           console.log(err);
           return helpers.response(res, null, 500, {message: 'something went wrong..'})
        }
    }
}
  
module.exports = {
    Login,
    Register,
    Activation
}