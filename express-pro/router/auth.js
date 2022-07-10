
const jwt = require('jsonwebtoken');
const { compare } = require('bcryptjs');
const express = require('express');

const router = express.Router();

require('../db/connection');
const Login = require("../model/loginSchema");
const Details = require("../model/uploadSchema");

router.get('/',(req,res)=>{
    res.send("Welcome to Activity Point Management router js");
});

// router.post('/Upload', (req,res) => {
    
//     const { mgitsid, file_url, doc_name, year, Activity_head, Program, Level,
//     Position, Organizer, Start_date, End_date, Description, Points } = req.body;


//     if (!doc_name || !year || !Activity_head || !Program || !Level || !Organizer || 
//         !Start_date || !End_date || !Description ){
//             console.log(req.body);
//             return res.status(422).json({ error: "Some required field not filled"});
//         }
    
//      const details = new Details({ mgitsid, file_url, doc_name, year, Activity_head, Program, Level,
//         Position, Organizer, Start_date, End_date, Description, Points
//        });
//        details.save().then(() =>{
//         res.status(201).json({ message: "Details uploaded successfully"});
//        }).catch((err) => {
//         console.log(err)
//         res.status(500).json({error:"Failed to registered"})
//        });
    
// });

router.post('/Upload', async (req,res) => {
    
    const { mgitsid, file_url, doc_name, year, Activity_head, Program, Level,
    Position, Organizer, Start_date, End_date, Description, Points } = req.body;


    if (!doc_name || !year || !Activity_head || !Program || !Level || !Organizer || 
        !Start_date || !End_date || !Description ){
            console.log(req.body);
            return res.status(422).json({ error: "Some required field not filled"});
        }
    
        try{
            const details = new Details({ mgitsid, file_url, doc_name, year, Activity_head, Program, Level,
                            Position, Organizer, Start_date, End_date, Description, Points
                        });
            const detailsUpload = await details.save();
            if(detailsUpload){
                res.status(201).json({ message: "Details uploaded successfully"});
            } else{
                res.status(500).json({error:"Failed to Upload"})
            }
        } catch(err) {
            console.log(err);
        }
    
});

router.post('/Login', async (req, res) => {
    //console.log(req.body);
    //res.json({message:"logged in"});
    try{
         let token;
         const { username, password } = req.body;

         if(!username || !password){
            return res.status(400).json({error:"Required field empty"})
         }

         const userLogin = await Login.findOne({username: username});  
         //console.log(userLogin);

         if(userLogin){
            const isMatch = await compare(password, userLogin.password);
             
            token = await userLogin.generateAuthToken();
            console.log(token);

            // res.cookie("jwtoken", token, {
            //     expires:new Date(Date.now() + 25892000000),
            //     httpOnly:true
            // });

            if(isMatch){
                res.status(400).json({error:"invalid credentials"});
            }else{
                res.json({
                    status:"SUCCESS",
                    message:"user logged in successfully",
                    token: token,
                    role: userLogin.userType
                })
            }
         }else{
            res.status(400).json({error:"invalid credentials"});
         }     
    }catch(err){
        console.log(err);
    }
})

module.exports = router ;