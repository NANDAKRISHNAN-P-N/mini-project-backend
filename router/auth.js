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
const { findOneAndUpdate } = require('../model/uploadSchema');
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
    const isMatch= Details.find({doc_name:doc_name, year:year,mgitsid:mgitsid});
    if(isMatch){
        return res.status(422).json({error:"Document name already exist in this year"});
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
        console.log(error);
        res.status(500).json({
            error:'Something went wrong'
        })
    }
})

router.post('/fetchFirstyear', async(req,res) =>{
    try{
        console.log(req.body);
        const who = req.body.student;
        const year = req.body.year;
        console.log(who);
        const needed = await Details.find( { mgitsid:who , year:year });
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


router.post('/calculateAP', async(req,res) => {
    try{
        const Batch = req.body.batch;
        const Branch = req.body.branch;
        const name = req.body.name;
        const year = req.body.year;
        const document = req.body.document;
        console.log(name+" "+year+" "+document+" "+Batch+" "+Branch);
        const x = await Student.find({ batch:Batch , branch: Branch , name: name})
        console.log(x);
        const mgtemp = x[0].MgitsId;
        console.log(mgtemp);
        const det = await Details.find({ mgitsid:mgtemp , year:year , doc_name:document })
        console.log(det);
        const activityhead = det[0].Activity_head;
        const activity = det[0].Activity;
        const position = det[0].Position;
        const level = det[0].Level;
        const organizer = det[0].Organizer;
        console.log(level);
        let newp = 0;
        if(activityhead == 'National Initiatives'){
            let diff = (det[0].End_date.getTime() - det[0].Start_date.getTime())/1000;
            diff /= (60 * 60 * 24);
            diff = Math.round(diff/365.25)
            console.log(diff);
            if(activity == 'NCC'){
                 if(diff<2){
                    res.json({
                        message:"Years of working minimum 2 needed"
                    })
                 }else{
                    if(position=='C Certification'){
                        newp=80;
                    }else if(position == 'Pre Republic Day Camp'){
                        newp=70;
                    }else if(position='Republic Day Camp'){
                        newp=80;
                    }
                 }
            }else{
                if(diff<2){
                    res.json({
                        message:"Years of working minimum 2 needed"
                    })}else{
                        if(position=='C Certification'){
                            newp=80;
                        }else if(position == 'Pre Republic Day Camp'){
                            newp=70;
                        }else if(position=='Republic Day Camp'){
                            newp=80;
                        }else if(position=='Best NSS Volunteer'){
                            newp=70;
                        }
                    }
            }
            const assign = await Details.findOneAndUpdate({_id:det[0]._id},{Points:newp,Status:"verified"},{new:true});
            if(assign){
                res.json({
                    status:"SUCCESS",
                    message:"Points calculated",
                    data:assign
                })
            }else{
                res.json(error)({
                    error:"Something went wrong in calculation"
                })
            }
        }else if(activityhead=='Cultural Activities'){
            if(activity=="Music" || activity=="Performing Arts" || activity=="Literary Arts"){
                if(level=='Level 1'){
                    if(position=='1'){
                        newp=18;
                    }else if(position=='2'){
                        newp=16;
                    }else if(position=='3'){
                        newp=13;
                    }else if(position=='Participation'){
                        newp=8;
                    }
                 }else if(level=='Level 2'){
                    if(position=='1'){
                        newp=22;
                    }else if(position=='2'){
                        newp=20;
                    }else if(position=='3'){
                        newp=17;
                    }else if(position=='Participation'){
                        newp=12;
                    }
                 }else if(level=='Level 3'){
                    if(position=='1'){
                        newp=30;
                    }else if(position=='2'){
                        newp=28;
                    }else if(position=='3'){
                        newp=25;
                    }else if(position=='Participation'){
                        newp=20;
                    }
                 }else if(level=='Level 4'){
                    if(position=='1'){
                        newp=60;
                    }else if(position=='2'){
                        newp=56;
                    }else if(position=='3'){
                        newp=52;
                    }else if(position=='Participation'){
                        newp=40;
                    }else if(level=='Level 5'){
                        console.log("uf");
                        if(position=='1'){
                            newp=80;
                        }else if(position=='2'){
                            newp=76;
                        }else if(position=='3'){
                            newp=72;
                        }else if(position=='Participation'){
                            newp=60;
                        }
                     }
                 }
            }
            const assign = await Details.findOneAndUpdate({_id:det[0]._id},{Points:newp,Status:"verified"},{new:true});
            if(assign){
                res.json({
                    status:"SUCCESS",
                    message:"Points calculated",
                    data:assign
                })
            }else{
                res.json(error)({
                    error:"Something went wrong in calculation"
                })
            }
        }else if(activityhead=='Sports and Games'){
            if(activity =='Sports' || activity =='Games'){
                if(level =='Level 1'){
                    if(position=='1'){
                        newp=18;
                    }else if(position=='2'){
                        newp=16;
                    }else if(position=='3'){
                        newp=13;
                    }else if(position=='Participation'){
                        newp=8;
                    }
                }else if(level =='Level 2'){
                    if(position=='1'){
                        newp=25;
                    }else if(position=='2'){
                        newp=23;
                    }else if(position=='3'){
                        newp=20;
                    }else if(position=='Participation'){
                        newp=15;
                    }
                }else if(level =='Level 3'){
                    if(position=='1'){
                        newp=35;
                    }else if(position=='2'){
                        newp=33;
                    }else if(position=='3'){
                        newp=30;
                    }else if(position=='Participation'){
                        newp=25;
                    }
                }else if(level =='Level 4'){
                    if(position=='1'){
                        newp=60;
                    }else if(position=='2'){
                        newp=56;
                    }else if(position=='3'){
                        newp=52;
                    }else if(position=='Participation'){
                        newp=40;
                    }
                }else if(level =='Level 5'){
                    if(position=='1'){
                        newp=80;
                    }else if(position=='2'){
                        newp=76;
                    }else if(position=='3'){
                        newp=72;
                    }else if(position=='Participation'){
                        newp=60;
                    }
                }
            }
            const assign = await Details.findOneAndUpdate({_id:det[0]._id},{Points:newp,Status:"verified"},{new:true});
            if(assign){
                res.json({
                    status:"SUCCESS",
                    message:"Points calculated",
                    data:assign
                })
            }else{
                res.json(error)({
                    error:"Something went wrong in calculation"
                })
            }
        }else if(activityhead=='Proffessional Self Initiatives'){
            if(activity=='Tech Fest' || activity=='Tech Quiz'){
                if(level=="Level 1"){
                    newp=10;
                }else if(level=='Level 2'){
                    newp=20;
                }else if(level=='Level 3'){
                    newp=30;
                }else if(level=='Level 4'){
                    newp=40;
                }else if(level=='Level 5'){
                    newp=50;
                }
            }else if(activity=="MOOC"){
                newp=50;
            }else if(activity=='Competition conducted by Proffessional societies'){
                if(level=="Level 1"){
                    newp=10;
                }else if(level=='Level 2'){
                    newp=15;
                }else if(level=='Level 3'){
                    newp=20;
                }else if(level=='Level 4'){
                    newp=30;
                }else if(level=='Level 5'){
                    newp=40;
                }
            }else if(activity=="Attending Conference/Seminar/Workshop/Exhibition" || activity=="Short Term Training Program"){
                if(organizer=="IITS" || organizer=="NITS"){
                    newp=15;
                }else{
                    newp=6;
                }
            }else if(activity=='Paper presentation' || activity=='Paper Publication'){
                if(organizer=='IITS' || organizer=='NITS'){
                    if(position=='Certificate of Recognition'){
                        newp=30;
                    }else{
                        newp=20;
                    }
                }else{
                    if(position=='Certificate of Recognition'){
                        newp=10;
                    }else{
                        newp=8;
                    }
                }
            }else if(activity=='Poster Presentation'){
                if(organizer=='IITS' || organizer=='NITS'){
                    if(position=='Certificate of Recognition'){
                        newp=20;
                    }else{
                        newp=10;
                    }
                }else{
                    if(position=='Certificate of Recognition'){
                        newp=6;
                    }else{
                        newp=4;
                    }
                }
            }else if(activity=="Industrial Training/Internship(5days)"){
                newp=20;
            }else if(activity=="Industrial/Exhibition Visit"){
                newp=5;
            }else if(activity=="Foreign Language Skills(IELTS,BEC,TOEFL)"){
                newp=50;
            }
            const assign = await Details.findOneAndUpdate({_id:det[0]._id},{Points:newp,Status:"verified"},{new:true});
            if(assign){
                res.json({
                    status:"SUCCESS",
                    message:"Points calculated",
                    data:assign
                })
            }else{
                res.json(error)({
                    error:"Something went wrong in calculation"
                })
            }
        }else if(activityhead=="Entrepreneurship and Innovation"){
            if(activity=="StartUpCompany"){
                newp=60;
            }else if(activity=="Patent-Filed"){
                newp=30;
            }else if(activity=="Patent-Published"){
                newp=35;
            }else if(activity=="Patent-Approved"){
                newp=50;
            }else if(activity=="Patent-Licensed"){
                newp=80;
            }else if(activity=="Prototype developed and tested"){
                newp=60;
            }else if(activity=="Awards for product developed"){
                newp=60;
            }else if(activity=="Innovative Technologies Developed"){
                newp=60;
            }else if(activity=="Got Venture Capital Funding for Innovative idea?Products"){
                newp=80;
            }else if(activity=="Start Employment"){
                newp=80;
            }else if(activity=="Societal Innovations"){
                newp=50;
            }
            const assign = await Details.findOneAndUpdate({_id:det[0]._id},{Points:newp,Status:"verified"},{new:true});
            if(assign){
                res.json({
                    status:"SUCCESS",
                    message:"Points calculated",
                    data:assign
                })
            }else{
                res.json(error)({
                    error:"Something went wrong in calculation"
                })
            }
        }else if(activityhead=="Leadership and Management"){
            if(activity=="Student Proffessional Societies" || activity=="College Association Chapters" || activity=="Festival or Technical Events" || activity=="Hobby Clubs"){
                if(position=="Core coordinator"){
                    newp=15;
                }else if(position=="Sub Coordinator"){
                    newp=10;
                }else if(position=="Volunteer"){
                    newp=5;
                }
            }else if(activity=="Elected student representatives"){
                if(position=="Chairman"){
                    newp=30;
                }else if(position=="Secretary"){
                    newp=25;
                }else if(position=="Council Member"){
                    newp=15;
                }
            }
            const assign = await Details.findOneAndUpdate({_id:det[0]._id},{Points:newp,Status:"verified"},{new:true});
            if(assign){
                res.json({
                    status:"SUCCESS",
                    message:"Points calculated",
                    data:assign
                })
            }else{
                res.json(error)({
                    error:"Something went wrong in calculation"
                })
            }
        }
    }catch(error){
          console.log(error);
    }
})
module.exports = router ;