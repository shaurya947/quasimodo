var express = require('express');
var fs = require('fs');
var videoIdFilePath = '/youtube/video-ids';

// read file synchronously into memory
var videoIdArray = fs.readFileSync(__dirname + videoIdFilePath).toString().split('\n');
videoIdArray.pop();

var app = express();

app.get('/', function(req, res){
	// return rando video id
	res.send(videoIdArray[Math.floor(Math.random() * videoIdArray.length)]);
});

app.listen(3000, function(){
	console.log('Server running on port 3000');
})