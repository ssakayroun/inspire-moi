//we get the translation service
var watson= require('watson-developer-cloud');
var language_translation=  watson.language_translator({
	username:'e04cb45c-8c3e-46dd-8766-83c57b7aca4e',
	password:'w65zH94bN7fi',
	version:'v2'
});

var result= function(text, from, to){
	language_translation.translate({
	    text: text,
	    source: from,
	    target: to
	  }, function(err, translation) {
	    if (err)
	      console.log(err)
	    else
	      return String(translation.translations[0].translation);
	});
}
module.exports = result;