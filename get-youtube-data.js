var request = require('request');
var fs = require('fs');
var videoIdFilePath = '/youtube/video-ids';
var baseURL = 'https://www.googleapis.com/youtube/v3/';

// clear file before writing
fs.writeFile(__dirname + videoIdFilePath, '', function(err){
	if(err)
		return console.log(err);

	startWriteProcess();
});

var startWriteProcess = function() {
	// get key from file
	fs.readFile(__dirname + '/youtube/key', function(err, data){
		if(err){
			return console.log(err);
		}

		var key = data.toString();

		// get channel names
		fs.readFile(__dirname + '/youtube/channels', function(err, data){
			if(err){
				return console.log(err);
			}

			var channels = data.toString().split('\n');

			channels.forEach(function(cName){
				var channelDataString = baseURL + 
						'channels?part=contentDetails&forUsername=' + cName + 
						'&key=' + key;

				request(channelDataString, function (error, response, channelData) {
				  if (!error && response.statusCode == 200) {
				    var uploadsPlaylistId = JSON.parse(channelData).items[0].contentDetails.relatedPlaylists.uploads;

				    var uploadsPlaylistDetailsString = baseURL + 
				    		'playlistItems?part=contentDetails&playlistId=' + 
				    		uploadsPlaylistId + '&maxResults=50&key=' + key;

				    writeUploadsPlaylistData(uploadsPlaylistDetailsString, uploadsPlaylistId, key);
				  }
				});
			});
		});
	});	
};

// loop through all uploads and add them to file
var writeUploadsPlaylistData = function(uploadsPlaylistDetailsString, uploadsPlaylistId, key){
	request(uploadsPlaylistDetailsString, function(error, response, uploadsPlaylistData) {
		if(!error && response.statusCode == 200) {
			var tempArray = [];
			var uploadsPlaylistDataAsJSON = JSON.parse(uploadsPlaylistData);
			
			uploadsPlaylistDataAsJSON.items.forEach(function(playlistItem){
				tempArray.push(playlistItem.contentDetails.videoId);
			});

			fs.appendFile(__dirname + videoIdFilePath, tempArray.join('\n') + '\n', function(err){
				if(err)
					return console.log(err);

				getVideoIdsOnNextPage(uploadsPlaylistDataAsJSON.nextPageToken, uploadsPlaylistId, key);
			});
		}
	});
};

// if next page token exists, call writeUploadsPlaylistData again
var getVideoIdsOnNextPage = function(nextPageToken, uploadsPlaylistId, key) {
	if(nextPageToken) {
		var uploadsPlaylistDetailsString = baseURL + 
			  'playlistItems?part=contentDetails&playlistId=' + 
			  uploadsPlaylistId + '&maxResults=50&key=' + key +
			  '&pageToken=' + nextPageToken;

		writeUploadsPlaylistData(uploadsPlaylistDetailsString, uploadsPlaylistId, key);
	}
};