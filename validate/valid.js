const Joi = require('joi')

"use strict";

const Valid = Joi.object({
    fName: Joi.string().required().min(3),

    lName: Joi.string().required().min(1),
    
    pNumber: Joi.number().required().min(10000000).max(9999999999).error(new Error('Please enter a valid phone number')),

    dob: Joi.date().required().error(new Error('Please enter a valid DOB')),

    gender: Joi.string().required().error(new Error('Please enter a valid Gender')),

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),

    address: Joi.string().required().error(new Error('Please enter a valid Address')),

    countryCode: Joi.string().required().error(new Error('Please enter a valid countryCode')),

    //isActive: Joi.boolean().required().default(false).error(new Error('Please enter a valid isActive')),

    confirm: Joi.string().required().error(new Error('Please enter a valid confirm')),

    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Please enter a valid password'))

})

//validation User SignUp
const signupUser = async (req, res, next) => {
    try {
        
        await Valid.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
        err.status = res.status(400).json({ status: 400, message: err.message || err } )
    next(err)
      
    }
};

const Validating = Joi.object({


    username:Joi.string().email().allow("").error(new Error('Please enter a valid Email ID')).required(),
   
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).error(new Error('Please enter a valid Password')).required()

})

//validation User Login
const loginUser = async (req, res, next) => {
    try {
        
       let {val} = await Validating.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
         err.status =   res.status(400).json({ status: 400, message: err.message || err} )
    next(err)
      
    }
};

//Validation User Update
const updateUser = async (req, res, next) => {
    try {
        
        await Valid.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
        err.status = res.status(400).json({ status: 400, message: err.message || err } )
    next(err)
      
    }
};


const validateForgetPassword = Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Please enter a valid password'))

})

//------------>Validate Forgot Password
const updateForgotPAssword = async (req, res, next) => {
    try {
        
        await validateForgetPassword.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
        err.status = res.status(400).json({ status: 400, message: err.message || err } )
    next(err)
      
    }
};

module.exports = { signupUser,loginUser ,updateUser,updateForgotPAssword}