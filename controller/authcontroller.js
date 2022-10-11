const express = require('express')
const User = require('../model/user.model');
const Joi = require('joi');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = import("crypto");
const Token = require("../model/token");
const sendEmail = require("../middleware/email")
const router = express.Router();

"use strict";


//----------------------------------------------->Register Api
const register = async (req, res, next) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send("User with given email already exist!");

            user = await new User({
                fName: req.body.fName,
                lName: req.body.lName,
                dob: req.body.dob,
                gender: req.body.gender,
                email: req.body.email,
                address: req.body.address,
                countryCode: req.body.countryCode,
                pNumber: req.body.pNumber,
                password: hashedPass,
                confirm: req.body.confirm
            }).save();
            let token = await jwt.sign({ userId: user._id,  }, "verySecretValue", { expiresIn: '1hr' })
            const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token}`;
            await sendEmail(user.email, "Verify Email", message );
                res.send("An Email sent to your account please verify");
    } catch (error) {
        res.status(400).send("An error occured");
    }     
}
//--------------------------------->verifyEmail

const verifyEmail = async  (req, res, next) => {
  
    try {
      const tokenData = req.params.token;
      const decoded = await jwt.verify(tokenData, "verySecretValue");
  
      if(!decoded) return res.status(403).json({ status: 403, message: "The user email id does not exists" })
      
      else {
        let userUpdate = await User.update({ isActive: true });
        return res.status(200).send({ status: 200, message: "email ID verified  successfully" })
      }
  
    } catch (error) {
      res.status(400).send({ status: 400, success: false, msg: err.message })
    }
  ;
}
//----------------------------------------->Login Api
const login = async (req, res, next) => {
    try {
        var username = req.body.username
        var password = req.body.password
        const user = await User.findOne({  email: username  })

        if (user) {
            const result = await bcrypt.compare(password, user.password)
            console.log(result, user.password, password);

            if (result) {
                let token = jwt.sign({ fName: user.fName, _id: user._id }, "verySecretValue", { expiresIn: '1hr' })
                console.log(token);
                const data = { "fName": user.fName,
                    "lName": user.lName,
                    "dob": user.dob,
                    "gender": user.gender,
                    "email": user.email,
                    "address": user.address,
                    "countryCode": user.countryCode,
                    "pNumber": user.pNumber,
                    "password": user.password,
                    "isActive": user.isActive,
                    "confirmed":user.confirmed,
                    "token": token 
                };

                return res.status(200).json({ status: 200, message: 'Login Succesfully!!', data: data })

            }

            else {
                return res.json("Incorrect Password!!")
            }
        }
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message || error });
    }
}

//---------------------------------->Edit User Detail's
const editUser = async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const updated = await User.findOneAndUpdate({ _id: req.params.id },

            {
                $set: {

                    fName: req.body.fName,
                    lName: req.body.lName,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    email: req.body.email,
                    address: req.body.address,
                    countryCode: req.body.countryCode,
                    pNumber: req.body.pNumber,
                    password: hashedPass,
                    isActive: req.body.isActive,
                    confirmed: req.body.confirmed

                }
            }, { new: true });
        const data = { "fName": updated.fName,"lName": updated.lName,"dob": updated.dob,"gender": updated.gender, "email": updated.email,"address": updated.address,"countryCode": updated.countryCode, "pNumber": updated.pNumber,"password": updated.password,"isActive": updated.isActive,"confirmed": updated.confirmed };

        return res.status(200).json({ message: 'User Details Updated..', data: data });
    } catch (err) {
        console.log('Details not found!!')
        res.json({ error: err })
    }
}

//------------------------------------------>Delete User
const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id)
        if (!req.params.id) {
            return res.status(400).json({ error: "no id found"})
        }res.json("User Deleted")

    } catch (error) {
        //console.log('Cannot delete')
        res.json({ error: error })
    }
}

//--------------------------------------> Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const updatedPassword = await User.findOneAndUpdate({ _id: req.params.id },

            {
                $set: {
                     password: hashedPass
                }
            }, { new: true });
        const data = { "password": updatedPassword.password};
        return res.status(200).json({ message: 'Password Updated..', data: data });
    } catch (err) {
        console.log('Password not update!!')
        res.json({ error: err })
    }
}


// //------------->Register Api
// const register = async (req, res, next) => {
//     try {
//         const hashedPass = await bcrypt.hash(req.body.password, 10)
//         let user = new User({
//             fName: req.body.fName,
//             lName: req.body.lName,
//             dob: req.body.dob,
//             gender: req.body.gender,
//             email: req.body.email,
//             address: req.body.address,
//             countryCode: req.body.countryCode,
//             pNumber: req.body.pNumber,
//             password: hashedPass,
//             isActive: req.body.isActive,
//             confirmed: req.body.confirmed
//         });
//         const savedUser = await user.save();
//         res.status(200).json({ status: 200, message: "success", data: savedUser });
//     } catch (error) {
//         console.log(error);
//         if (error.code && error.code == 11000) {
//             return res.status(400).json({ status: 400, message: "Already exists user!" });
//         }
//         res.status(400).json({ status: 400, message: error.message || error });
//     }
// }

// const resetPassword = async (req, res) => { 
//     try { 
//         const id = req.params.id 
 
//         const newUser = await userData.findOne({ where: { customerID: id } }) 
//         const compare = await bcrypt.compare(req.body.password, newUser.password) 
//         if (compare) return res.status(400).send({ status: 400, message: "password is already exsits" }) 
//         if ((req.body.password !== req.body.confirmPassword)) { 
//             return res.status(404).send({ 
//                 message: 'password does not match' 
//             }) 
//         } 
//         if (!newUser) { 
//             return res.status(404).send({ 
//                 message: 'user not found' 
//             }) 
//         } 
//         const passData = await bcrypt.hash(req.body.password, 10) 
//         const result = await userData.update({ password: passData }, { where: { customerID: newUser.customerID } }) 
//         res.status(200).send({ status: 200, message: "password Reset  successfully", data: result }) 
//     } 
//     catch (err) { 
//         res.status(400).send({ status: 400, message: "something went wrong" || err }) 
//     } 
// }

module.exports = router;
module.exports = { verifyEmail, register, login, editUser, deleteUser,forgotPassword }