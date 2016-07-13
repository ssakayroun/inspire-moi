
var mongoose= require('mongoose');
var userSchema= mongoose.Schema({
	username:String,
	password:String,
	admin:Boolean,
	quotes:[String]
});

var user= mongoose.model('user', userSchema);
module.exports= user;