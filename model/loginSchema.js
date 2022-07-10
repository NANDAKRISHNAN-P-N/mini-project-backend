const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
     },
     tokens:[
      {
         token:{
            type:String,
            required:true
         }
      }
     ]
})


//hashing passsword
// loginSchema.pre('save', async function(next){
//      if(this.isModified('password')){
//        this.password =await bcrypt.hash(this.password, 12);
//      }
//      next();
// });

//generating token
loginSchema.methods.generateAuthToken = async function(){
   try{
      let token = jwt.sign({mgitsId:this.mgitsId}, process.env.SECRET_KEY);
      this.tokens = this.tokens.concat({ token: token });
      await this.save();
      return token;
   }catch(err){
       console.log(err);
   }
}

const User = mongoose.model('LOGIN', loginSchema);

module.exports = User;
