const mongoose = require("mongoose")

const userSecurity = new mongoose.Schema({
    isLocked:{
        required:true,
        type:Boolean,
    },
    failedAttempts:{
        required:true,
        type:Number
    },
    lastLoginAttempt:{
        required:true,
        type:String,
    },
    lastSuccessfullLogin:{
        required:true,
        type:String,
    },
    lastFailedLoginAttempt:{
        required:true,
        type:String,
    }
})

const user =  new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        
    },
    timestamp:{
        type: String,
        required: true,

    },
    security: userSecurity
})


module.exports = mongoose.model("users",user)