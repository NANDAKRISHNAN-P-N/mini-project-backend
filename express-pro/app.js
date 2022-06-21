const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app=express();

dotenv.config({path:'./config.env'});
require('./db/connection');
//const User = require('./model/loginSchema');

app.use(express.json());

// link the router files to make our route easy
app.use(require('./router/auth'));

const PORT= process.env.PORT;


//Middleware
const middleware= (req,res,next) =>{
     console.log("Hello my middleware");
     next();
}

app.get('/',(req,res)=>{
    res.send("Welcome to Activity Point Management");
});
app.get('/Signin', middleware, (req,res)=>{
    res.send("Welcome to Activity Point Management-Sign In");
});
app.get('/Yearly',(req,res)=>{
    res.send("Welcome to Activity Point Management-Yearly");
});
app.listen(PORT, ()=>{
    console.log("Listening to port number ${PORT}");
});