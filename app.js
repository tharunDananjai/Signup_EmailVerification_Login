const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const Joi = require('joi')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express();
const nodemailer = require("nodemailer");
//const Controller = require('./controller/authcontroller');

const Authroutes = require('./routes/auth.routes');
app.use(express.json());
mongoose.connect(process.env.DB_DATA)
const db = mongoose.connection

db.on("error",(err) =>{
    console.log(err);
})

db.once("open",() =>{
    console.log("Database is Connected");
})

app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const PORT = process.env.Port || 8080
app.listen(PORT,() => console.log(`Server is running @ ${PORT} `));

app.use('/api/user', Authroutes);
//app.use("/api/user", Controller);
