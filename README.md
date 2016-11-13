# Youtube API Gateway Demo

This is a simple express.js app which provides an API for searching and commenting on videos. this API is a front to the Youtube API for search, and stores comments locally in a Mongo database.

## Install
git clone https://github.com/syounger/youtube-api-demo


## Run
npm start

## Test
npm test


## Notes

The default install runs on localhost:3100. You can change the port in server/config.js .

The API uses jwt for tracking the user. To get a token, POST  {username: "your name"} to /login.
