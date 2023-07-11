var mongoose =require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');
// boilderplate           local host  port   anyname
mongoose.connect("mongodb://127.0.0.1:27017/Rytcareer_Signupdata");

var userSchema =mongoose.Schema({
  username:String,
  email:String,
  password:String,
  number:String,
  image:{
    type:String,
    default:"default.png"
  },
});
userSchema.plugin(passportLocalMongoose);
module.exports=  mongoose.model("user",userSchema)