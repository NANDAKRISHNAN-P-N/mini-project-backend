const express = require('express');
const router = express.router();

require('../db/connection');
const Login = require("../model/loginSchema");

//loginroute
router.post('/Login',(req, res) => {
    //console.log(req.body);
    //res.json({message:"logged in"});
    try{
         const { username, password } = req.body;

         if(!username || !password){
            return res.status(400).json({error:"Required field empty"})
         }

         const userLogin = Login.findOne({username: username});  
         console.log(userLogin);
         if(!userLogin){
         res.status(400).json({error:"user error"});  
         }     else{
                res.json({message:"user logged in successfully"})
         }
    }catch(err){
        console.log(err);
    }
})