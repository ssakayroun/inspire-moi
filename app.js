/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
'use strict'

var express = require('express');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
//var bson = require('bson')
var credentials= require('./credentials.js');

var handlebars= require('express-handlebars').create({defaultLayout:'main'})
//
const bodyParser = require('body-parser');

//
const request = require('request');

//
const token = "EAAQYl5frSF0BAFDv4NBEfaInKXvbw2JTUHr3wXcSFp81m2UQaPg21YyNcnow4c1DlFLeZCO3tpUx7LRklowgWUdOQH16cDyXZATZAHGDxsZCiZByAmi8gHfFnTW6mJAyhNCcvYjzcxM1VNxLiCa6K3sBdtCvsZCQUC5wkOAZAuF3wZDZD"

//

// create a new express server
var app = express();
//app.set('port', process.env.PORT || 3000);

//let us include a templating engine called handlebars
app.engine('handlebars', handlebars.engine);//tells the server to use handlebars' engine to process *.handlebars files
app.set('view engine', 'handlebars');//tell the app to use handlebars as the view engine
//we include the translation service
//var translator= require("./libs/watson_translate");

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var quote= require("./libs/quote_selector");

var mongoose = require('mongoose');
var opts={
	server:{
		socketOptions:{keepAlive:1}
	}
}
switch(app.get('env')){
	
	case 'development':
		mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	case 'production':
		mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	default:
		throw new Error('Unknown execution environment: '+ app.get('env'));
}

var user= require('./models/user.js');
var quoteObject= require('./models/quote.js');
/*we will now create initial users
user.find(function(err, users){
	if(err) return console.error(err);
	if(users.length) return;
	
	new user({
		username:"admin",
		password:"ss0438",
		admin:true,
		quotes:[]
	}).save();
	
	new user({
		username:"test",
		password:"",
		admin:false,
		quotes:[]
		
	}).save();
	
	
});

*/

//var MongoSessionStore = require('session-mongoose')(require('connect'));
var ad_id="";

/**************************** ADMIN PAGE HANDLINGS*********************************************/
app.get('/', function(req, res){
	res.render("index", {q:quote.getQuote()});
});
app.post('/admin',function(req, res){
	//req.flash("Thanks for the info "+ req.body.username);
//	res.redirect(303, '/');
	user.findOne({username:req.body.username, password:req.body.password},function(err, u){
		if(u){
			ad_id=u.id;
			res.render("admin",{us:u});
		}
		else
			res.render("admin",{error:"Your credentials failed"});
	});
});	

app.get('/admin', function(req, res){
	res.render("admin");
});
app.post('/save_quote', function(req, res){
	var a = req.body.author, b= req.body.quote;
	var r="";
	if(req.body.referrer){
		r=req.body.referrer;
	}
	else{
		r="admin";
	}
	quoteObject.find(function(err, records){
		if(err) return console.error(err);
		new quoteObject({
			sku:records.length+1,
			author:a,
			quote:b,
			by:[r],
			date: Date.now
		}).save();		
		
	});
	res.redirect('admin');
	
});

/*******************************for Facebook Authentification and verification****************************/
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'thisismytoken') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
});

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text;
			//var t= translator("Somethin","en","es");
			//alert(t);
			//console.log(t);
			if(text.toLowerCase()=="inspire me"){
				let q= quote.getQuote();
            	sendTextMessage(sender, "Here is a quote for you by " + q.author +". It goes as "+q.quote);
        	}
			else{
            	sendTextMessage(sender, "Please enter \"Inspire Me\" to receive a quote from the bot");
			}
		}
    }
    res.sendStatus(200)
})

//we handle not found urls
app.use(function(req,res, next){
	res.status('404');
	res.render('404');
});

//we handle internal server errors
app.use(function(req, res, next){
	res.status('500');
	res.render('500');
});

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



// start server on the specified port and binding host
app.listen(appEnv.port, function() {
  // print a message when the server starts listening
  //translator("hello", "en","es");
  console.log("server starting at" + appEnv.url);
});


