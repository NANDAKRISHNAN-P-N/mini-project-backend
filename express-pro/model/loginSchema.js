const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
     username:{
        type:String,
        required:true
     },
     password:{
        type:String,
        required:true
     },
     mgitsId:{
        type:String,
        required:true
     }
})

const User = mongoose.model('LOGIN', loginSchema);

module.exports = User;