const mongoose = require ('mongoose');

const uploadSchema = new mongoose.Schema({
    mgitsid:{
        type:String,
    },
    file_url:{
        type:String,
    },
    doc_name:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    Activity_head:{
        type:String,
        required:true
    },
    Activity:{
        type:String,
        required:true
    },
    Position:{
        type:Number,
        required:true
    },
    Level:{
        type:Number,
    },
    Organizer:{
        type:String,
        required:true
    },
    Start_date:{
        type:Date,
        required:true
    },
    End_date:{
        type:Date,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Points:{
        type:Number,
        default:0
    }
})

const Details = mongoose.model('UPLOAD',uploadSchema);
module.exports = Details ;