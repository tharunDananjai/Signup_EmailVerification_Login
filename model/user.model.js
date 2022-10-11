const Joi = require ('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
"use strict";
const userSchema = new Schema({
    
    fName : {type: String, required: true, trim: true},
    lName : {type: String, required: false, trim: true},
    dob : {type: Date, required: true},
    gender : {type: String, enum : ['Male','Female', 'Transgender'], required: true, trim: true},
    email : {type : String, required: true, unique: true, trim: true},
    address: {type: String,  required: true},
    countryCode: {type: String, required: true, trim: true},
    pNumber: {type: Number, required: true, unique: true, },
    password: {type: String, unique: true, required: true, trim: true},
    isActive: {type: Boolean, default: false},
    confirm:{type: String, required: true, trim: true}
}, { timestamp: true })


const User  = mongoose.model('user', userSchema);

module.exports = User;