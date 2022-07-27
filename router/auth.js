const jwt = require('jsonwebtoken');
const { compare } = require('bcryptjs');
const express = require('express');
const {cloudinary} = require('../utils/cloudinary');
//const bodyParser = require('body-parser')
const router = express.Router();

require('../db/connection');
const Login = require("../model/loginSchema");
const Details = require("../model/uploadSchema");
const Student = require("../model/studentSchema");
//const { application } = require('express');

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
    
    const { mgitsid, file_url,  doc_name, year, Activity_head, Activity, Position, Level,
           Organizer, Start_date, End_date, Description } = req.body;


    if ( !mgitsid || !doc_name || !year || !Activity_head || !Activity || !Position || !Organizer || !Level ||
         !Start_date || !End_date || !Description ) {
            console.log(req.body);
            return res.status(422).json({ error: "Some required field not filled"});
        }
        
        try{
            const details = new Details({  mgitsid, file_url, doc_name, year, Activity_head, Activity, Level,
                            Position, Organizer, Start_date, End_date, Description
                        });
            const detailsUpload = await details.save();
            if(detailsUpload){
                res.status(201).json({ 
                    status:"SUCCESS",
                    message: "Details uploaded successfully",
                 });
            } else{
                res.status(500).json({
                    status:"FAILURE",
                    error:"Failed to Upload"})
            }
        } catch(err) {
            console.log(err);
        }
    
});

router.post('/Login', async (req, res) => {
    console.log(req.body);
    try{
         let token;
         const { username, password } = req.body;

         if(!username || !password){
            return res.status(400).json({error:"Required field empty"})
         }

         const userLogin = await Login.findOne({username: username});  
         //console.log(userLogin);

         if(userLogin){

            if(password != userLogin.password){
                return res.status(400).json({
                    status:"FAILED",
                    message:"user log in failed",
                    token: " ",
                    role: " "
                });
            }else{
                token = await userLogin.generateAuthToken();
                console.log(token);
                res.json({
                    status:"SUCCESS",
                    message:"user logged in successfully",
                    token: token,
                    role: userLogin.userType,
                    userid: userLogin.username
                })
            }
         }else{
            return res.status(400).res.json({
                status:"FAILED",
                message:"user log in failed",
                token: " ",
                role: " "
            });
         }     
    }catch(err){
        console.log(err);
    }
})

// router.use(express.json({ limit: '50mb' }));
// router.use(express.urlencoded({ limit: '50mb', extended:true}));
//router.use(bodyParser.json({ limit: '50mb' }));
//router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

router.post('/Imageupload', async(req, res) =>{
    try{
        console.log("Inside Imageupload");
        const filestr = req.body.body;
        const student = req.body.userId;
        console.log(filestr);
        console.log(req.body.userId);
        const uploadedResponse = await cloudinary.uploader.upload(filestr, {
            upload_preset: 'ml_default'
        })
        console.log(uploadedResponse);
        res.json({
            message:"FILE UPLOADED SUCCESSFULLY"
        })
         await Details.findOneAndUpdate({ mgitsid:student , file_url:student+'url' },
                                         {file_url: uploadedResponse.url},{ new: true }) ;
    }catch(error){
        console.error(error);
        res.status(500).json({
            error:'Something went wrong'
        })
    }
})

router.post('/fetchFirstyear', async(req,res) =>{
    try{
        console.log(req.body);
        const who = req.body.student;
        console.log(who);
        const needed = await Details.find( { mgitsid:who , year:1 });
        console.log(needed);
        if(needed.length !=0 ){
        res.json({
            message:"details fetched",
            data:needed
        })}
        else{
            res.status(404).json({
                error:"No matching documents"
            })
        }
    }catch(error){
        console.log(error);
        res.status(404).json({
            err:"fetch failed"
        })
    }
});

router.post('/filterStudents',async(req,res) =>{
    try{
        console.log("batch:", req.body.batch);
        console.log("branch:",req.body.branch);
        const batch = req.body.batch;
        const branch = req.body.branch;
        const st = await Student.find( { batch:batch, branch:branch })
        console.log(st);
        if(st.length != 0){
            res.json({
                message:"students fetched",
                data:st
            })
        }else{
            res.status(404).json({
                error:"No matchings found"
            })
        }
    }catch(error){
           console.log("exeption from find");
           console.log(error);
    }
})

router.patch('/resetPassword', async(req,res) =>{
     try{
          const username = req.body.username;
          const password = req.body.password;
          const cpassword = req.body.cpassword;
          console.log(username,password,cpassword);
          if( password == cpassword){
             const upda = await Login.findOneAndUpdate({username : username}, {password : password},{new:true})
             if(upda){
                console.log(upda);
                res.json({
                    status:"SUCCESS"
                })
          }}
     }catch(error){
         console.log(error);
     }
})


router.post('/fetchUploads', async(req,res) => {
    try{
         Batch = req.body.batch;
         Branch = req.body.branch;
         Name = req.body.name;
         Year = req.body.year;
         const x = await Student.find({ batch:Batch , branch: Branch , name: Name})
         console.log(x);
         const mgtemp = x[0].MgitsId;
         console.log(mgtemp);
         const det = await Details.find({ mgitsid:mgtemp , year:Year })
         console.log(det);
         if(det.length!=0){
            res.json({
                message:"details fetched",
                status:"SUCCESS",
                data: det
            })
         }else{
            res.status(404).json({
                error:"No matchings for this student"
            })
         }
    }catch(error){
        console.log(error);
    }
})
module.exports = router ;