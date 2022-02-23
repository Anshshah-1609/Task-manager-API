const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task.js')

// Generate the schema for User
const userSchema = new mongoose.Schema({
    name:{
        type : String,
        trim : true,
        required : true
    },
    age:{
        type : Number,
        required : true,
        default : 0,
        validate(value) {
            if(value < 0){
                throw new Error("Age Must be Positive")
            }
        }
    },
    email:{
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        Validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid!")
            }
        }
    },
    password:{
        type : String,
        required : true,
        minlength : 7,
        max : 12,
        trim : true,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error("Password can't contain 'password' word")
            }
        }
    },
    tokens: [{
        token:{
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
},{
    timestamps : true
})

userSchema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})
// Method for hinding private data of user
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// Methd for Generating Token for User
userSchema.methods.makeAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id:user._id.toString()},process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

// check and validate the user details for login
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({ email:email })
    if(!user) {
        throw new Error("Enable to login!")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Password does not Match!!")
    }

    return user
}
// converting password to hashed passwordbefore storing database
userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,9)
    }
    
    next()
})
// Delete tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner : user._id })
    next()
})

// create a Model
const User = mongoose.model('User', userSchema)

// Export User model
module.exports = User
