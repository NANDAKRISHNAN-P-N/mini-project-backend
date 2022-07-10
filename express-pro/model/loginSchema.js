const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
     },
     userType:{
        type:String,
        required:true,
        default:"Student"
     }
})


//hashing passsword
loginSchema.pre('save', async function(next){
     if(this.isModified('password')){
       this.password =await bcrypt.hash(this.password, 12);
     }
     next();
});

const User = mongoose.model('LOGIN', loginSchema);

module.exports = User;
