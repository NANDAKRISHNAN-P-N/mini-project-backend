const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app=express();

dotenv.config({path:'./config.env'});
require('./db/connection');
//const User = require('./model/loginSchema');

app.use(express.json());
const corsOpts = {
    AccessControlAllowOrigin: '*',
    methods: [
      'GET',
      'POST',
      'PATCH'
    ],
    allowedHeaders: [
      'Content-Type',
    ],
  };
app.use(cors(corsOpts));

// link the router files to make our route easy
app.use(require('./router/auth'));
//app.use(express.limit(100000000));
//app.use(express.urlencoded({ limit: 100000000, extended:true}));
//const bodyParser = require('body-parser')
//app.use(bodyParser.json({ limit: '50mb' }));
//app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const PORT= process.env.PORT;


//Middleware
const middleware= (req,res,next) =>{
     console.log("Hello my middleware");
     next();
}

app.get('/Upload',(req,res)=>{
    res.send("Welcome to Activity Point Management");
});
app.get('/Login', middleware, (req,res)=>{
    //res.cookie("Test", 'nandu');
    res.send("Welcome to Activity Point Management-Sign In");
});
app.listen(PORT, ()=>{
    console.log("Listening to port number", PORT);
});