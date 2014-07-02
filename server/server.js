'use strict';


var winston= require("winston");
var express = require("express");
var http = require("http");
var app = express();
var fs = require('fs');
var reqLogger = require('express-request-logger');
var passport = require('passport'); 
var LocalStrategy = require('passport-local').Strategy;
	
// our project includes
var config = require('./config');
 
var mysql = require('mysql');
var Q = require("q");

var path = require('path')
// include routes
var html_files = require('./routes/html_files');
 
 
var logger = new (winston.Logger)({ 
		transports: [ 
		  new (winston.transports.Console)( {colorize: 'true'}) ,
		  new (winston.transports.File)({ filename: 'pm.log' })
]});

// app.use(express.logger());  
app.use(reqLogger.create(logger));
app.use(express.bodyParser({uploadDir:'../uploads'}));
//persistent login sessions (recommended).
app.use(express.cookieParser());
app.use(express.session({ secret: 'bumzacktrara' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(config.directories.clientDir));
console.log('gggggggggggg - static: ' + __dirname + '/../client');
console.log('config.directories.clientDir : ' +config.directories.clientDir) ;


function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}
  
 
// add our routes 
 
html_files.addRoutes(app, config);
 

app.get('/loggedin', function(req, res) { 
	if (process.env.NODE_ENV === 'development') {
		var user = {};
		user.username = "dev";
		user.password = "dev";
		user.id = 43;
		res.send(user);
	} else {
		res.send(req.isAuthenticated() ? req.user : '0');
	}	 
});

app.post('/login', passport.authenticate('local'), function(req, res) { 
	// // console.log('GET /login'); 
	res.send(req.user); 
}); 

app.get('/logout', function(req, res) {
	  req.logout();
	  res.send(200);
});

function auth(req, res, next) { 
	if (process.env.NODE_ENV === 'development') {
		next (); 
	} else {
		if (!req.isAuthenticated()) 
			res.send(401); 
		else 
			next();
	}	 
};
  
var getUserById = function (id, db) {
	var deferred = Q.defer();
	// console.log('in getAllDonations ');
	var sql; 
	var sql = 'SELECT  * FROM `' + tableUser + '`  WHERE id = ' + id;
	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

var getUserByUsername = function (username, db) {
	var deferred = Q.defer();
	// console.log('in getAllDonations ');
	var sql; 
	var sql = 'SELECT  * FROM `' + tableUser + '`  WHERE username = \"' + username +'\"';
	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};
 
function findById (id, fn) {
	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});  
 	getUserById(id, databaseMonitor).then(function(rows) {
  	// 	console.log('"findById" - rows  : ' + JSON.stringify(rows)); 
  		
		if (rows[0][0] != undefined) {
			var user = rows[0][0]; 
	  		console.log('"findById" - user:  ' + JSON.stringify(user)); 
			fn(null, user);
		} else {
			fn(new Error('User ' + id + ' does not exist'));
	    } 
	}); 
} 

var tableUser = 'user';
 
function findByUsername   (username, fn) {
	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});  
	
	getUserByUsername(username, databaseMonitor).then(function(rows) {
   		if (rows[0][0] != undefined) {
			var user = rows[0][0]; 
	   		console.log('"findByUsername" - user: ' + JSON.stringify(user)); 
 			return fn(null, user);
		}  
   		return fn(null, null);
	});  
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
		done(err, user);
	});
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
	function(username, password, done) {
		// // console.log('passport.use:   username: ' + username);
		// // console.log('passport.use:   password: ' + password);
		// 	asynchronous verification, for effect...
		process.nextTick(function () {
			// 	Find the user by username.  If there is no user with the given
			// username, or the password is not correct, set the user to `false` to
			// 	indicate failure and set a flash message.  Otherwise, return the
			// authenticated `user`.
            findByUsername(username, function(err, user) {
            	if (err) { 
            		// // console.log('passport.use:   err: ' + err);
            		return done(err); 
            	}
            	if (!user) { 
            		// // console.log('passport.use:   user nicht gefunden : ');
            		return done(null, false, { message: 'Unknown user ' + username }); 
            	}
            	if (user.password != password) { 
            		// // console.log('passport.use:   password falsch ');
            		return done(null, false, { message: 'Invalid password' }); 
            	}
        		// // console.log('passport.use:   user/password OK ');
                return done(null, user);
            })
		});
	}
));




 



function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}
 
var tableProjects = "projects"; 
var tableUniqueIds = "unique_id"; 
var tableEtherpads = "etherpads"; 
var tableTasks = "tasks"; 
var tableFileGroups = 'taskfilegroup';
var tableFiles = "taskfiles";
var tableLinks = "tasklink";


//  create db-wide unique id ...
var getUniqueId = function (table, db) {
	var deferred = Q.defer();
	console.log('in getUniqueId');	
	var sql = 'INSERT INTO `' + tableUniqueIds + '` (`tablename`) VALUES  (\"' +  table + '\") ';
	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};



// TODO: Jean: this function should take as input an array of table names 
// and return the first unique id which was inserted (the last id can be calculated by adding the length
// of the array
var getUniqueIds = function (tables, db) {
	
};








var insertNewProject = function (uid, projecttitle, user_uid, db) {
	var deferred = Q.defer();
	console.log('in insertNewProject');	
	console.log(' in insertNewProject projecttitle: ' +  projecttitle);

	var ts = new Date().getTime(); 
	var sql = 'INSERT INTO `' + tableProjects + '` (uid, project_title, user_uid, deleted, created) VALUES ';
	sql += '(' + uid + ', \"' +  mysql_real_escape_string(projecttitle) + '\",' + user_uid + ', false, ' + ts + ')'; 	
 	console.log('insertNewProject: sql' + sql);

 	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

var insertEtherpad  = function (uid, etherpadName, project_uid, user_uid, db) {
	var deferred = Q.defer();
	console.log('in insertEtherpads');
	console.log(' in insertNewProject etherpadName: ' +  etherpadName);

	var ts = new Date().getTime(); 
	var sql = 'INSERT INTO `' + tableEtherpads + '`   (uid, project_uid, name, user_uid, deleted, created) VALUES ';
	sql += '(' + uid  + ',' + project_uid + ', \"' +  mysql_real_escape_string(etherpadName) + '\",' + user_uid + ', false, ' + ts + ')'; 	
 	console.log('insertEtherpads: sql' + sql);

 	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};
 

app.post("/newproject",  auth,  function(req, res) {
 	console.log("matching request function POST  '/newproject'");
 	console.log('req.body.projecttitle: ' + req.body.projecttitle);


 	var user_uid = req.body.user_uid; 
	
 	console.log("++++++++++++++++++");
 	console.log(req  );
 	console.log(req.body );
 	var idIstSchonBenutzt=true;
	 
 	// to the server is loggedin. we can't rely on the client, as a the login could be faked by inserting
 	// javascript code in the browser console (firebug) 
	// OK!
 	if(user_uid===undefined){//SONST undefined
		//console.log('SCHAU MAL?!!!! req.body.user_uid: ' +  user_uid); 

		{//herstellt eine zufällige falsche neue id	 
			var trials = 0;  
			
			for(;trials<100;trials++)  //doesn´t use Q
				if (idIstSchonBenutzt){
				user_uid=Math.floor(Math.random()*10000);  //zufällige  
				{ // für den Fall, wenn diese uid schon existiert. Er ist sehr sehr selten.
					 var strQuery  = "SELECT * from projects  WHERE user_uid =  "+ user_uid+" ;";
					  //console.log(strQuery);				 
					 var databaseMonitor = mysql.createConnection({
							  host     : config.databaseMonitor.host,
							  user     : config.databaseMonitor.username,
							  password : config.databaseMonitor.password,
							  database : config.databaseMonitor.database,
							  debug		: false
					});
					databaseMonitor.query( strQuery, function(err, rows ){
								if(err)	{
									console.log("ERR="+ err.message);
									idIstSchonBenutzt=false;//Ich gebe auf!
									user_uid=-1;
									//console.log( "Ich gebe auf!");
								}else{
								idIstSchonBenutzt=(rows.length!==0);	
								console.log(user_uid+"   hier  "+rows.length+"  "+idIstSchonBenutzt);
							
								for(var i=0;i<rows.length;i++)
									console.log( "already : Zeile= "+rows[i].project_title+" "+rows[i].user_uid );
								}
								});	
					databaseMonitor.end(function(err){ 
							});
					}
					}
			if(trials>100){  
							console.log( "trials>=100 !!!!!");
							user_uid=-1;
							}
				
		}
	}
	
	
	
 	if(false)  
 	      user_uid=  540546;
				 
 	console.log('req.body.user_uid: ' + req.body.user_uid);

 	var projecttitle = req.body.projecttitle; 
 	var etherpadName1 = req.body.etherpadTopics; 
 	var etherpadName2 = req.body.etherpadProtocol;
 	var user_uid = req.body.user_uid;

				 
	
 	console.log('etherpadName1: ' + etherpadName1);
 	console.log('etherpadName2: ' +etherpadName2);

	console.log('newproject   req.body: ' + JSON.stringify(req.body));

  	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
 	
 	// get 3 new ids for the project and 2 etherpads 
 	 

  	// TODO Jean:   replace this Q.all call with a call to the new getUniqueIds function
  	// by passing a array of the table names to the function 
  	// this is a speed improvement: by calling getUniqueId three times
  	// we execute three database write statements.
  	// if we change this to getUniqueIds, we achieve the same with one database write statement
  
	var group = Q.all([getUniqueId(tableProjects,  databaseMonitor), 
	                    getUniqueId(tableEtherpads,  databaseMonitor),
	                    getUniqueId(tableEtherpads,  databaseMonitor)]);
 	 
 	group.then(function(array) {
 	    var project_uid = array[0][0].insertId; // result of promise1
 	    var etherpadUid1 = array[1][0].insertId; // result of promise2
 	    var etherpadUid2 = array[2][0].insertId; // result of promise2
 
 	 	console.log(' in group.then projecttitle: ' +  projecttitle); 
 	 	
 	    var group2 = Q.all([insertNewProject(project_uid, projecttitle, user_uid, databaseMonitor),
 	                       insertEtherpad(etherpadUid1, etherpadName1, project_uid, user_uid, databaseMonitor),
 	                       insertEtherpad(etherpadUid2, etherpadName2, project_uid, user_uid, databaseMonitor)]);  
 	    
 	    group2.then(function(array2) {
 	    	var json = {
 	    			project_uid : project_uid,
						msg: "Projekt erfolgreich angelegt",
						etherpadTopicsUid : etherpadUid1,
						etherpadProtocolUid : etherpadUid2,
						projecttitle 	    : projecttitle

			}
 	    	console.log('app.post("/newproject")  success: ');
			res.json(json); 	    	
 	    })
 	    .fail(function(err) {
 	  		console.log('group2 ERROR in  POST  /newproject err: ' + err); 
 	 		res.send(500, 'Query error in POST  /newproject !'); 
 	 	}).done(function() {
 	  		console.log('group2 alles gut in  POST  /newproject: '); 
 	 		// databaseMonitor.end();
 	 	});  
 	}).fail(function(err) {
  		console.log('ERROR in  POST  /newproject err: ' + err); 
 		res.send(500, 'Query error in POST  /newproject !'); 
 	}).done(function() {
  		console.log('alles gut in  POST  /newproject: '); 
 		databaseMonitor.end();
 	});  
});

var getAllProjects = function (db) {
	var deferred = Q.defer();
	console.log('in getAllProjects');
  	var sql = 'SELECT * FROM `' + tableProjects + '` WHERE deleted = false ';
  	console.log('getAllProjects: sql' + sql);
  	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

var getAllEtherpads = function (db) {
	var deferred = Q.defer();
	console.log('in getAllEtherpads');
  	var sql = 'SELECT * FROM `' + tableEtherpads + '` WHERE deleted = false ';
  	console.log('getAllEtherpads: sql' + sql);
  	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
}; 

var getAllTasks = function (db) {
	var deferred = Q.defer();
	console.log('in getAllTasks');
  	var sql = 'SELECT * FROM `' + tableTasks + '`  ';
  	
  	var sql = 'SELECT ' + tableTasks + '.*,  ' + tableUser + '.firstname FROM `tasks`';  
  	sql += 'LEFT JOIN `' + tableUser + '` ON ' + tableTasks + '.user_uid = ' + tableUser + '.id ' ;
  	sql += 'WHERE ' + tableTasks + '.deleted = false' 
  	console.log('getAllTasks: sql' + sql);
  	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

var getAllFileGroups = function (db) {
	var deferred = Q.defer();
	console.log('in getAllFileGroups');
  	var sql = 'SELECT * FROM `' + tableFileGroups  + '` WHERE deleted = false ';
  	console.log('in getAllFileGroups: sql' + sql);
  	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

var getAllFiles= function (db) {
	var deferred = Q.defer();
	console.log('in getAllFiles');
  	var sql = 'SELECT * FROM `' + tableFiles + '` WHERE deleted = false ';
  	console.log('in getAllFiles: sql' + sql);
  	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

var getAllLinks = function (db) {
	var deferred = Q.defer();
	console.log('in getAllLinks');
  	var sql = 'SELECT * FROM `' + tableLinks + '` WHERE deleted = false ';
  	console.log('in getAllLinks: sql' + sql);
  	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

app.get("/projects", auth, function(req, res) {
	console.log("matching request function GET  '/projects'");
  
	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: true
	});
 	 
	var group = Q.all([getAllProjects(databaseMonitor), 
	                   getAllEtherpads(databaseMonitor),
	                   getAllTasks(databaseMonitor),
	                   getAllFileGroups(databaseMonitor),
	                   getAllFiles(databaseMonitor), 
	                   getAllLinks(databaseMonitor)]);
 	 
 	group.then(function(array) { 
 	    var json = {
 	    		projects   : array[0][0], 
 	    		etherpads  : array[1][0], 
 	    		tasks      : array[2][0],
 	    		fileGroups : array[3][0],
 	    		files      : array[4][0],
 	    		links      : array[5][0]
 	    }
 	    res.json(json);  
 	}).fail(function(err) {
  		console.log('ERROR in  GET  /projects err: ' + err); 
 		res.send(500, 'Query error in GET  /projects !'); 
 	}).done(function() {
  		console.log('alles gut in  POST  /projects: '); 
 		databaseMonitor.end();
 	});  
 	
});
 
var insertTask  = function (uid, task, project_uid, user_uid, type, status, db) {
	var deferred = Q.defer();
	console.log('in insertTask');
 
	var ts = new Date().getTime(); 
	var sql = 'INSERT INTO `' + tableTasks + '`   (uid, project_uid, task, user_uid, deleted, created, type, status) VALUES ';
	sql += '(' + uid  + ',' + project_uid + ', \"' +  mysql_real_escape_string(task) + '\",' + user_uid + ', false, ' + ts;
	sql += ', \"' +  mysql_real_escape_string(type) + '\", \"' +  mysql_real_escape_string(status) + '\")'; 	
 	console.log('insertTask: sql' + sql);

 	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};
   
var insertFileForProject  = function (file_uid, filename, filelocation, project_uid, user_uid, db) {
	var deferred = Q.defer();
	console.log('in insertFile');
		 
	var ts = new Date().getTime(); 
	var sql = 'INSERT INTO `' + tableFiles + '`   (uid, filename, filelocation, project_uid, user_uid, deleted,  created) VALUES ';
	sql += '(' + file_uid  + ', \"' +  mysql_real_escape_string(filename) + '\",\"' +  mysql_real_escape_string(filelocation) + '\",';
	sql += project_uid + ', ' + user_uid + ', false, ' + ts + ')'; 	
 	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
}; 

app.post("/project/fileupload", auth, function(req, res) {
	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
	
  	var user_uid = req.body.user_uid;
  	var username = req.body.username;
  	var project_uid = req.body.project_uid;

  	var oldDir =req.files.file.path;
  	var filename = path.basename(oldDir);
  	var filelocation = config.directories.downloadDir + '/'+ username + '/'  ;
  	 
  	if (!fs.existsSync(filelocation)) {
  		console.log('mkdir: ' +filelocation); 
  		fs.mkdirSync(filelocation);
  	}
  	filelocation += filename; 
  	
  	fs.renameSync(oldDir, filelocation);

  	filename = req.files.file.originalFilename;
  	
  	getUniqueId(tableFiles, databaseMonitor).then(function(result) {
 	    var file_uid = result[0].insertId; // result of promise1
    	console.log('app.post("/ttask/fileupload")  file_uid: ' + file_uid);
 	   insertFileForProject(file_uid, filename, filelocation, project_uid, user_uid, databaseMonitor).then(function(){
    		var f = {
    				uid : file_uid,
    				filename : filename,
    				filelocation : filelocation, 
    				project_uid : project_uid, 
    				user_uid : user_uid    				
    		};
    		var json = {
    				file: f,
    	  	    	msg : "Fileupload successful!"
    		}; 	
    	 	res.json(json);   
    	}).fail(function(err) {
      		res.send(500, 'Query error in POST  /project/fileupload !'); 
     	}).done(function() {
       	});   
 	}).fail(function(err) {
  		res.send(500, 'Query error in POST  /project/fileupload !'); 
 	}).done(function() {
  		databaseMonitor.end();
 	});   
}); 


app.post("/newtask",  auth,  function(req, res) {
 	console.log("matching request function POST  '/newtask'");
 	console.log('req.body.task: ' + req.body.task);
 	console.log('req.body.project_uid: ' + req.body.project_uid);
 	console.log('req.body.user_uid: ' + req.body.user_uid);
 
 	var task = req.body.task; 
 	var project_uid = req.body.project_uid; 
  	var user_uid = req.body.user_uid;
  	var type = req.body.type;
  	var status = req.body.status;

  	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
 	
 	// get 1 new id  for the Tasks 
 
	getUniqueId(tableTasks, databaseMonitor).then(function(result) {
 	    var task_uid = result[0].insertId; // result of promise1
    	console.log('app.post("/newtask")  task_uid: ' + task_uid);
	    	
 	    insertTask(task_uid, task, project_uid, user_uid, type, status, databaseMonitor).then(function() {
  	    	var json = {
  	    				uid : task_uid,
						task: task
			}
 	    	console.log('app.post("/newtask")  success: ');
			res.json(json); 	    	
 	    })
 	    .fail(function(err) {
 	  		console.log('insertTask ERROR in  POST  /newtask err: ' + err); 
 	 		res.send(500, 'Query error in POST  /newtask !'); 
 	 	}).done(function() {
 	  		console.log('insertTask alles gut in  POST  /newtask: '); 
 	 		// databaseMonitor.end();
 	 	});  
 	}).fail(function(err) {
  		console.log('ERROR  getUniqueId in  POST  /newtask err: ' + err); 
 		res.send(500, 'Query error in POST  /newtask !'); 
 	}).done(function() {
  		console.log('alles gut in  POST  /newtask: '); 
 		databaseMonitor.end();
 	});  
});

var updateTask  = function (task, db) {
	var deferred = Q.defer();
	console.log('in updateTask');
 
	var ts = new Date().getTime(); 
	var sql = 'UPDATE  `' + tableTasks + '` SET ';
	sql += 'task = \"' +  mysql_real_escape_string(task.task) + '\",';
	sql += 'start = \"' +  mysql_real_escape_string(task.start) + '\",';
	if (task.end != 0) {
		sql += 'end = \"' +  mysql_real_escape_string(task.end) + '\",'; 
	} 
	sql += 'type = \"' +  mysql_real_escape_string(task.type.type) + '\" ';
	sql += ' WHERE uid = ' + task.uid;

  	console.log('updateTask: sql' + sql);

 	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};
  
app.put("/task/data", auth,  function(req, res) {
 	console.log("matching request function PUT  '/task/data'");
 	console.log('req.body.task: ' + JSON.stringify(req.body.task));
  
 	var task = req.body.task; 
  
  	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
 	updateTask(task, databaseMonitor).then(function() {
  	  	var json = {
			msg : 'Update taskdata erfolgreich'
		}
 	   	console.log('app.put("/task/data")  success: ');
		res.json(json); 	    	
 	})
 	.fail(function(err) {
 		console.log('insertTask ERROR in  PUT  /task/data err: ' + err); 
 	 	res.send(500, 'Query error in POST  /task/data !'); 
 	}).done(function() {
 		console.log('ende in  PUT  /task/data: '); 
 	 	databaseMonitor.end();
 	 });
});

var updateTaskComment  = function (task, db) {
	var deferred = Q.defer();
	console.log('in updateTaskComment');
 
	var ts = new Date().getTime(); 
	var sql = 'UPDATE  `' + tableTasks + '` SET ';
	sql += 'comment = \"' +  mysql_real_escape_string(task.comment) + '\" '; 
	sql += ' WHERE uid = ' + task.uid;

  	console.log('updateTaskComment: sql' + sql);

 	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};
  
app.put("/task/comment", auth,  function(req, res) {
 	console.log("matching request function PUT  '/task/comment'");
 	console.log('req.body.task: ' + JSON.stringify(req.body.task)); 	
 	console.log('req.params.id: ' + req.params.id);

 	var task = req.body.task; 
 
  	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
 	updateTaskComment(task, databaseMonitor).then(function() {
  	  	var json = {
			msg : 'Update /task/comment/ erfolgreich'
		}
 	   	console.log('app.put("/task/comment")  success: ');
		res.json(json); 	    	
 	})
 	.fail(function(err) {
 		console.log('insertTask ERROR in  PUT  /task/comment err: ' + err); 
 	 	res.send(500, 'Query error in POST  /task/comment !'); 
 	}).done(function() {
 		console.log('ende in  PUT  /task/comment: '); 
 	 	databaseMonitor.end();
 	 });
});


var updateTaskStatus  = function (task_uid, status, db) {
	var deferred = Q.defer();
	console.log('in updateTaskComment');
 
	var ts = new Date().getTime(); 
	var sql = 'UPDATE  `' + tableTasks + '` SET ';
	sql += 'status = \"' +  mysql_real_escape_string(status) + '\" '; 
	sql += ' WHERE uid = ' + task_uid;

  	console.log('updateTaskComment: sql' + sql);

 	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};
  
app.put("/task/status", auth,  function(req, res) {
 	console.log("matching request function PUT  '/task/status'");
 	console.log('req.body.status: ' + JSON.stringify(req.body.status));
 	console.log('req.body.task_uid: ' + JSON.stringify(req.body.task_uid));

 	var status = req.body.status; 
 	var task_uid = req.body.task_uid; 

  	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
 	updateTaskStatus(task_uid, status, databaseMonitor).then(function() {
  	  	var json = {
			msg : 'Update /task/status/ erfolgreich'
		}
 	   	console.log('app.put("/task/status")  success: ');
		res.json(json); 	    	
 	})
 	.fail(function(err) {
 		console.log('insertTask ERROR in  PUT  /task/status err: ' + err); 
 	 	res.send(500, 'Query error in POST  /task/status !'); 
 	}).done(function() {
 		console.log('ende in  PUT  /task/status: '); 
 	 	databaseMonitor.end();
 	 });
});
//-------------------------- Task - FileGroups  ---------------------------------------
 


var insertFileGroup  = function (filegroup_uid, description, task_uid, db) {
	var deferred = Q.defer();
	console.log('in insertFileGroup');
		 
	var ts = new Date().getTime(); 
	var sql = 'INSERT INTO `' + tableFileGroups + '`  (uid, description, task_uid, deleted, created) VALUES ';
	sql += '(' + filegroup_uid  + ', \"' +  mysql_real_escape_string(description) + '\",' + task_uid + ', false, ' + ts + ')'; 	
	console.log('insertFileGroup: sql' + sql);

	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

app.post("/task/newfilegroup",  auth,  function(req, res) {
 	console.log("matching request function POST  '/task/newfilegroup'");
 	console.log('req.body.description: ' + req.body.description);
 	console.log('req.body.task_uid: ' + req.body.task_uid);
 //	console.log('req.body.userId: ' + req.body.userId);
 
 	var description = req.body.description; 
 	var task_uid = req.body.task_uid; 
  //	var userId = req.body.userId;
 
  	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
 	
 	// get 1 new id  for the filegroup 
 
	getUniqueId(tableFileGroups, databaseMonitor).then(function(result) {
 	    var filegroup_uid = result[0].insertId; // result of promise1
    	console.log('app.post("/task/newfilegroup")  filegroup_uid: ' + filegroup_uid);
	    	
 	    insertFileGroup(filegroup_uid, description, task_uid,  databaseMonitor).then(function() {
  	    	var json = {
  	    			filegroupId : filegroup_uid,
  	    			description : description
			}
 	    	console.log('app.post("/task/newfilegroup")  success: ');
			res.json(json); 	    	
 	    })
 	    .fail(function(err) {
 	  		console.log('insertTask ERROR in  POST  /task/newfilegroup err: ' + err); 
 	 		res.send(500, 'Query error in POST  /task/newfilegroupv !'); 
 	 	}).done(function() {
 	  		console.log('insertTask alles gut in  POST  /task/newfilegroup: '); 
 	 		// databaseMonitor.end();
 	 	});  
 	}).fail(function(err) {
  		console.log('ERROR  getUniqueId in  POST  /task/newfilegroup err: ' + err); 
 		res.send(500, 'Query error in POST  /task/newfilegroup !'); 
 	}).done(function() {
  		console.log('alles gut in  POST  /task/newfilegroup: '); 
 		databaseMonitor.end();
 	});  
});

var deleteFileGroup  = function (filegroupId, db) {
	var deferred = Q.defer();
	console.log('in deleteFileGroup');
		 
	var ts = new Date().getTime(); 
	var sql = 'DELETE FROM `' + tableFileGroups + '`  WHERE uid = ' + filegroupId;
 	console.log('deleteFileGroup: sql' + sql);

	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

app.del("/task/filegroup/:id",  auth,  function(req, res) {
 	console.log("matching request function DELETE '/task/filegroup/:id'");
 	console.log('req.params.id: ' + req.params.id);
  //	console.log('req.body.userId: ' + req.body.userId);
 
 	var id = req.params.id; 
   //	var userId = req.body.userId;
 
  	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
 	
 	// get 1 new id  for the filegroup 
 
	deleteFileGroup(id, databaseMonitor).then(function() {
 	    var json = {
 	    	filegroup_uid : id,
  	    	msg : "Erfolgreich gelöscht"
		}
 	    console.log('app.del("/task/filegroup")  success: ');
		res.json(json); 	    	  
 	}).fail(function(err) {
  		console.log('Query error in DEL  /task/filegroup/:id    err: ' + err); 
 		res.send(500, 'Query error in DEL  /task/filegroup/:id     !'); 
 	}).done(function() {
  		console.log('fertig in  DEL  /task/filegroup/:id '); 
 		databaseMonitor.end();
 	});  
});


//-------------------------- Task -Files ---------------------------------------






var deleteFile  = function (fileId, db) {
	var deferred = Q.defer();
	console.log('in deleteFile');
		 
	var ts = new Date().getTime(); 
	var sql = 'DELETE FROM `' + tableFiles  + '`  WHERE uid = ' + fileId;
 	console.log('deleteFile: sql' + sql);
 	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

app.del("/task/file/:id",  auth,  function(req, res) {
 	console.log("matching request function DELETE '/task/file/:id'");
 	console.log('req.params.id: ' + req.params.id);
  //	console.log('req.body.userId: ' + req.body.userId);
 
 	var id = req.params.id; 
   //	var userId = req.body.userId;
 
  	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	}); 
  
	deleteFile(id, databaseMonitor).then(function() {
 	    var json = {
  	    	file_uid : id,
  	    	msg : "File erfolgreich gelöscht"
		}
 	    console.log('app.del("/task/file")  success: ');
		res.json(json); 	    	  
 	}).fail(function(err) {
  		console.log('Query error in DEL  /task/file/:id    err: ' + err); 
 		res.send(500, 'Query error in DEL  /task/file/:id     !'); 
 	}).done(function() {
  		console.log('fertig in  DEL  /task/file/:id '); 
 		databaseMonitor.end();
 	});  
});
 

//-------------------------- Task - Links ---------------------------------------
  
var insertLink   = function (link_uid, url, linkname, task_uid, db) {
	var deferred = Q.defer();
	console.log('in insertLink');
		 
	var ts = new Date().getTime(); 
	var sql = 'INSERT INTO `' + tableLinks + '`   (uid, url, linkname, task_uid, deleted,  created) VALUES ';
	sql += '(' + link_uid  + ', \"' +  mysql_real_escape_string(url) + '\",\"' +  mysql_real_escape_string(linkname) + '\",';
	sql += task_uid + ', false, ' + ts + ')'; 	
	console.log('insertLink: sql' + sql);

	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

app.post("/task/newlink",  auth,  function(req, res) {
 	console.log("matching request function POST  '/task/newlink'");
 	console.log('req.body.url: ' + req.body.url);
 	console.log('req.body.task_uid: ' + req.body.task_uid);
	console.log('req.body.linkname: ' + req.body.linkname);
 
 	var linkname = req.body.linkname; 
 	var task_uid = req.body.task_uid; 
	var url = req.body.url;
	 
	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
	
	// get 1 new id  for the filegroup 

	getUniqueId(tableLinks, databaseMonitor).then(function(result) {
	    var link_uid = result[0].insertId; // result of promise1
	    console.log('app.post("/task/newlink")  link_uid: ' + link_uid);
	    	
	    insertLink(link_uid, url, linkname, task_uid, databaseMonitor).then(function() {
	    	var json = {
	    			link_uid : link_uid,
	    			linkname : linkname,
	    			url: url
			}
	    	console.log('app.post("/task/newlink")  success: ');
			res.json(json); 	    	
	    })
	    .fail(function(err) {
	  		console.log('insertTask ERROR in  POST  /task/newlink err: ' + err); 
	 		res.send(500, 'Query error in POST  /task/newlink !'); 
	 	}).done(function() {
	  		console.log('insertTask alles gut in  POST  /task/newlink: '); 
	 		// databaseMonitor.end();
	 	});  
	}).fail(function(err) {
		console.log('ERROR  getUniqueId in  POST  /task/newlink err: ' + err); 
		res.send(500, 'Query error in POST  /task/newlink !'); 
	}).done(function() {
		console.log('alles gut in  POST  /task/newlink: '); 
		databaseMonitor.end();
	});  
}); 

var deleteLink  = function (linkId, db) {
	var deferred = Q.defer();
	console.log('in deleteLink');
		 
	var ts = new Date().getTime(); 
	var sql = 'DELETE FROM `' + tableLinks  + '`  WHERE uid = ' + linkId;
 	console.log('deleteLink: sql' + sql);
 	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
};

app.del("/task/link/:id",  auth,  function(req, res) {
 	console.log("matching request function DELETE '/task/link/:id'");
 	console.log('req.params.id: ' + req.params.id);
  //	console.log('req.body.userId: ' + req.body.userId);
 
 	var id = req.params.id; 
   //	var userId = req.body.userId;
 
  	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	}); 
  
  	deleteLink(id, databaseMonitor).then(function() {
 	    var json = {
 	    	link_uid : id,
  	    	msg : "Link erfolgreich gelöscht"
		}
 	    console.log('app.del("/link/file")  success: ');
		res.json(json); 	    	  
 	}).fail(function(err) {
  		console.log('Query error in DEL  /task/link/:id    err: ' + err); 
 		res.send(500, 'Query error in DEL  /task/link/:id     !'); 
 	}).done(function() {
  		console.log('fertig in  DEL  /task/link/:id '); 
 		databaseMonitor.end();
 	});  
});
 

//-------------------------- task - file upload ---------------------------------------
var insertFile  = function (file_uid, filename, filelocation, filegroup_uid, user_uid, db) {
	var deferred = Q.defer();
	console.log('in insertFile');
		 
	var ts = new Date().getTime(); 
	var sql = 'INSERT INTO `' + tableFiles + '`   (uid, filename, filelocation, filegroup_uid, user_uid, deleted,  created) VALUES ';
	sql += '(' + file_uid  + ', \"' +  mysql_real_escape_string(filename) + '\",\"' +  mysql_real_escape_string(filelocation) + '\",';
	sql += filegroup_uid + ', ' + user_uid + ', false, ' + ts + ')'; 	
	console.log('insertFile: sql' + sql);

	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
}; 

app.post("/task/fileupload", auth, function(req, res) {
	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
	
  	var user_uid = req.body.user_uid;
  	var username = req.body.username;
  	var filegroup_uid = req.body.filegroup_uid;

  	var oldDir =req.files.file.path;
  	var filename = path.basename(oldDir);
  	var filelocation = config.directories.downloadDir + '/'+ username + '/'  ;
  	  console.log('filename: ' + filename );

  	  console.log('oldDir: ' + oldDir );
   console.log('filelocation: ' + filelocation );
  	
  	if (!fs.existsSync(filelocation)) {
  		 console.log('mkdir: ' +filelocation); 
  		fs.mkdirSync(filelocation);
  	}
  	filelocation += filename; 
  	
  	fs.renameSync(oldDir, filelocation);

  	filename = req.files.file.originalFilename;
  	
  	getUniqueId(tableFiles, databaseMonitor).then(function(result) {
 	    var file_uid = result[0].insertId; // result of promise1
    	 console.log('app.post("/ttask/fileupload")  file_uid: ' + file_uid);
    	insertFile(file_uid, filename, filelocation, filegroup_uid, user_uid, databaseMonitor).then(function(){
    		var f = {
    				uid : file_uid,
    				filename : filename,
    				filelocation : filelocation, 
    				filegroup_uid : filegroup_uid, 
    				user_uid : user_uid    				
    		};
    		var json = {
    				file: f,
    	  	    	msg : "Fileupload successful!"
    		};
    		 console.log('app.post("/task/fileupload"  success: ');
    	 	 console.log('app.post("/task/fileupload"  json: ' +JSON.stringify(json));			
    	 	res.json(json);   
    	}).fail(function(err) {
      		 console.log('ERROR  insertFile in  POST  /task/fileupload err: ' + err); 
     		res.send(500, 'Query error in POST  /task/fileupload !'); 
     	}).done(function() {
      		 console.log('insertFile /task/fileupload: '); 
      	});   
 	}).fail(function(err) {
  		 console.log('ERROR  getUniqueId in  POST  /task/fileupload err: ' + err); 
 		res.send(500, 'Query error in POST  /task/fileupload !'); 
 	}).done(function() {
  		  console.log('alles gut in  POST  /task/newfiles: '); 
 		databaseMonitor.end();
 	});   
});

var getFile  = function (file_uid, db) {
	var deferred = Q.defer();
 		 
	var ts = new Date().getTime(); 
	var sql = 'SELECT * FROM  `' + tableFiles + '` WHERE uid = ' + file_uid; 
	db.query(sql, deferred.makeNodeResolver());  
	return deferred.promise;
}; 

app.get("/file/download/:id",  auth,  function(req, res) {
	console.log("matching request function get  '/file/download/id'");
 	console.log('req.params.id: ' + req.params.id);
 	 
 	var databaseMonitor = mysql.createConnection({
		  host     : config.databaseMonitor.host,
		  user     : config.databaseMonitor.username,
		  password : config.databaseMonitor.password,
		  database : config.databaseMonitor.database,
		  debug		: false
	});
	
	var file_uid = req.params.id;
 	getFile(file_uid, databaseMonitor).then(function(result) {
 		var f = result[0][0];
 		console.log('f: ' + JSON.stringify(f));
 	 	res.download(f.filelocation, f.filename);
 	}).fail(function(err) {
  		 console.log('ERROR  GET  /file/download/:id err: ' + err); 
 		res.send(500, 'Query error in GET  /file/download/:id !'); 
 	}).done(function() {
  		console.log('ende von GET  /file/download/:id erreicht '); 
 		databaseMonitor.end();
 	});   
});  


 
 
	
http.createServer(app).listen(config.server.listenPort);
