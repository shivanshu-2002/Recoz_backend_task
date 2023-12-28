const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true
        },
        accountType:{
             type:String,
             enum:["Instructor","Student"]
        },
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
          }],
          token: {
			type: String,
		},
})

module.exports = mongoose.model("User",userSchema);