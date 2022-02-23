const mongoose = require('mongoose')

// Schema for Task 
const taskschema = new mongoose.Schema({
    description :{
        type : String,
        trim : true,
        maxlength : 50,
        required : true
    },
    status :{
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{
    timestamps : true
})
// create a Model
const Task = mongoose.model('Task',taskschema)
module.exports = Task