'use strict';

var fs = require('fs');

exports.addRoutes = function(app, config) {

	app.get("/partials/:sitename", function(req, res) {
		console.log('html_files.app.get("/partials/:sitename")  ');

		var filename = config.directories.clientDir + config.directories.htmlFiles  + "partials/" + req.params.sitename; 
	 	console.log("matching request funtion '/partials/:sitename'");
		console.log("sending file: "  + filename); 
		if (fs.existsSync(filename)) {
			res.sendfile(filename);
		} else {
			res.send('file not found?', 404);
		}
	});
	
	app.get("/", function(req, res) {
		console.log('html_files.app.get("/")  ');
		var filename = "index.html"; 
 		filename = config.directories.clientDir + config.directories.htmlFiles  +"/" + filename; 
	 
		if (fs.existsSync(filename)) {
			console.log("file does exist!!");
			console.log("schalala");

			res.sendfile(filename );
		} else {
			console.log("file not found!! filename: " + filename);
			res.send('file    not found?');
		}
	}); 
};