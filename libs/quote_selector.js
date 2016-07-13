
var mongoose= require("mongoose");
var credentials= require('../credentials.js');
var o= require("../models/quote.js");


//mongoose.connect(credentials.mongo.development.connectionString, opts);


o.find(function(err,quotes){
	exports.getQuote = function(){
		return quotes[Math.floor(Math.random()*quotes.length)];
	}
});


/*

var list=[
	{
		id:1,
		author:"Steven Sakayroun",
		quote:"There is nothing more precious than the love of the other"
	},
	{
		id:2,
		author:"Jesus Christ",
		quote:"But I say to you, Love your enemies and pray for those who persecute you, so that you may be sons of your Father who is in heaven; for he makes his sun rise on the evil and on the good, and sends rain on the just and on the unjust."
	},
	{
		id:3,
		author:"H.Jackson Brown Jr.",
		quote:"The best preparation for tomorrow is doing your best today"
	}
	
	
];

exports.getQuote=function(){
	return list[Math.floor(Math.random()*list.length)];
}*/