const express = require('express')
const Validate = require ('../validate/valid')
const router = express.Router();


const Authcontroller = require('../controller/authcontroller'); 

//const Controller = require('./controller/authcontroller');

router.post('/register',Validate.signupUser, Authcontroller.register)

router.post('/login',Validate.loginUser, Authcontroller.login)

router.put("/editUser/:id",Validate.updateUser, Authcontroller.editUser)

router.delete("/deleteUser/:id",Authcontroller.deleteUser)

router.put("/forgotPassword/:id",Validate.updateForgotPAssword, Authcontroller.forgotPassword)

router.get("/verify/:id/:token",Authcontroller.verifyEmail)
module.exports = router;