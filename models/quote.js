var mongoose= require('mongoose');

var quoteSchema= mongoose.Schema(
{
	sku:String,
	author:String,
	quote:String,
	by:[String],
	date:Date 
});

var quote = mongoose.model('quote', quoteSchema);
module.exports=quote;