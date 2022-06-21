const express = require('express');

const router = express.Router();

require('../db/connection');
const Details = require("../model/uploadSchema");

router.get('/',(req,res)=>{
    res.send("Welcome to Activity Point Management router js");
});

router.post('/Signin',(req,res) => {
    
    const { mgitsid, file_url, doc_name, year, Activity_head, Program, Level,
    Position, Organizer, Start_date, End_date, Description, Points } = req.body;


    if (!doc_name || !year || !Activity_head || !Program || !Level || !Organizer || 
        !Start_date || !End_date || !Description ){
            console.log(req.body);
            return res.status(422).json({ error: "Some required field not filled"});
        }
    
     const details = new Details({ mgitsid, file_url, doc_name, year, Activity_head, Program, Level,
        Position, Organizer, Start_date, End_date, Description, Points
       });
       details.save().then(() =>{
        res.status(201).json({ message: "Details uploaded successfully"});
       }).catch((err) => {
        console.log(err)
        res.status(500).json({error:"Failed to registered"})
       });
    
});
module.exports = router ;