#!/usr/bin/env node


/// GLOBAL VARIABLES - CHANGE THESE
var PORT = 8888;
var DB_ADDRESS = "localhost";
var DB_PORT = 27017;
/// --- END GLOBAL VARIABLES ---





/*
 * Set up the HTTP server
 */

var http = require('http');
var fs = require('fs');
var url = require('url');

var application = http.createServer(function(req, res) {
    // respond to known files
    if (req.url == '/chat.js')
    {
	res.writeHead(200, {'Content-Type':'application/javascript'});
	var fileStream = fs.createReadStream('./chat.js');
	fileStream.end = function(){res.end();};
	fileStream.pipe(res);
	return;
    }
    // assume the request is for a room
    var room_id = url_to_room(req.url);
    if (room_id) {
	parse_room(room_id, req, res);
    }
    // otherwise, just serve the index
    else {
	res.writeHead(200, {'Content-Type':'text/html'});
	var fileStream = fs.createReadStream('./index.html');
	fileStream.end = function(){res.end();};
	fileStream.pipe(res);
    }
});


/*
 * Set up the database connection
 */

var mongo = require('mongodb');
var db, rooms;

(new mongo.Db('chattus', new mongo.Server(DB_ADDRESS, DB_PORT, {}))).open(function(err, database) {
    if (err) {
	console.log(err);
	process.exit();
    }
    db = database;
    db.collection('rooms', function(err, collection) {
	if (err) {
	    console.log(err);
	    proces.exit();
	}
	rooms = collection;
	application.listen(PORT);
	console.log("Listening");
    });
});


/*
 * Set up the room parsing function, connecting the database and HTTP
 */

function parse_room(room_id, req, res) {
    rooms.findOne({_id:room_id}, function(err, room) {
	if (err) console.log(err);
	// check for the prior existance of the room
	if (!room) {
	    rooms.insert({_id:room_id, log:[]}, function(err, result) {
		parse_room(result[0]['_id'], req, res);
	    });
	    return;
	}
	var query = url.parse(req.url, true).query;
	// handle a "get" log request
	if (query['get_log'] == '') {
	    rooms.findOne({_id:room_id}, function(err, room) {
		if (err) console.log(err);
		res.writeHead(200, {'Content-Type':'application/json'});
		res.end(JSON.stringify(room.log.sort(function(a,b) {
		    if (a.time > b.time)
			return 1;
		    if (a.time < b.time)
			return -1;
		    return 0;
		}).slice(0,32)));
	    });
	}
	// handle a "post" message request
	else if (query['post_message'] == '') {
	    res.writeHead(200, {'Content-Type':'application/json'});
	    var data = {
		name:query['name'].substr(0,31),
		content:query['content'].substr(0,255),
		time:parseInt((new Date()).getTime()/1000)
	    }
	    rooms.update({_id:room_id}, {$push:{log:data}}, {}, 
			 function(err, resp) {
			     if (err) console.log(err);
			     res.end(resp);
			 });
	}
	else {
	    res.writeHead(200, {'Content-Type':'text/html'});
	    var fileStream = fs.createReadStream('./chat.html');
	    fileStream.end = function(){res.end();};
	    fileStream.pipe(res);
	}
    });
}

function url_to_room(url) {
    var index_of_q = url.indexOf('?');
    var room_id = url.substring(1,(index_of_q<0?url.length:index_of_q));
    if (room_id.length != 5)
	return null;
    var code = 0;
    for (var i = 0; i < 5; i++) {
	code = room_id.charCodeAt(i);
	if ((code < 48 || code > 57) && 
	    (code < 65 || code > 90) && 
	    (code < 97 || code > 122))
	    return null;
    }
    return room_id;
}







