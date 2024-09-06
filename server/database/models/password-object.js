const mongoose = require("mongoose")
const objectMetadata = new mongoose.Schema({
    owner:{
        required:true,
        type:String
    },
    creationDate:{
        required: true,
        type:Date,
    },
    creationDateFormatted:{
        require:true,
        type: String,
    }
    ,
    hasChanged:{
        required:true,
        type:Boolean
    },
    timesChanged:{
        required:true,
        type:Number,
    }

})
const passwordObject = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        source:{
            type:String,
            required:true,
        }, 
        userId:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            required: true,
        },
        password:{
            type:String,
            required:true
        },
        description:{
            type:String,
        },
        specialChar:{
            type:String,
        },
        creationDate:{
            type:Date,
        },
        expiryDate:{
            type:Date
        },
        medatada:objectMetadata
    }
)



module.exports = mongoose.model("userpasswords",passwordObject)