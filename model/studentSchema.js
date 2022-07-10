const mongoose = require ('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    batch:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    MgitsId:{
        type:String,
        required:true
    }
})

const Student = mongoose.model('STUDENT', studentSchema);

module.exports = Student;