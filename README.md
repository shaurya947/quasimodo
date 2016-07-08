# quasimodo
Node server that returns a random youtube video id of a djent song

## To run

- Clone the repository
- Make sure you have added your youtube developer key (see below under "other files")
- `npm i` and `npm start`
- The server is listening at port 3000; port can be changed in `server.js`

The server only has the default route configured (`/`) and responds to all requests by simply returning a random youtube video id of a djent song. The video can then be played by navigating to `https://youtube.com/watch?v=<video-id>`

YouTube channels used:

- [DjentWorldwideTV](https://www.youtube.com/user/DjentWorldwideTV)
- [ItDjentsTV](https://www.youtube.com/user/ItDjentsTV)

## Main files

`get-youtube-data.js`: calls the youtube data API to get video ids and stores them at `/youtube/video-ids`

`server.js`: loads the video ids into memory and starts the server

## Other files

`/youtube/channels`: list of resource channel names, with each channel on a new line by itself

`/youtube/key`: your youtube developer key on a line by itself. This file is not included. You need to add your own key ([see how](https://developers.google.com/youtube/v3/getting-started))
