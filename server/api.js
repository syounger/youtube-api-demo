var express = require('express');
var router = express.Router();
var config = require('./config');
var util = require('util');
var bb = require('bluebird');

var helpers = require('./lib/helpers');
var youtube = require('./lib/youtube')(config);

/**
 * search for videos on youtube
 * @param q search query
 */
router.get('/search/:q', function(req, res) {
    youtube.search(req.params.q).then(function(resp) {
        res.json(helpers.videoDetailsList(resp.data.items, config.api));
    });
});

/**
 * get details of a video
 * @param video youtube video id
 */
router.get('/details/:video', function(req, res) {
    youtube.details(req.params.video).then(function(resp) {
        var details = resp.data.items;

        if (details && details.length) {
            res.json(helpers.extractVideoDetails(details[0], config.api));
        } else {
            res.json({});
        }
    });
});

/**
 * get comments for the given video
 * @param video youtube video id
 * @get start pagination - starting record
 * @get count pagination - number of results to return
 */
router.get('/comments/:video', function(req, res) {
    bb.Promise.join(
            youtube.comment.count(req.params.video),
            youtube.comment.find(req.params.video, req.query.start, req.query.count)
        )
        .then(function(results) {
            res.send({
                count: results[0],
                comments: results[1]
            });
        });
});

/**
 * add comment to video
 * @param video youtube video id
 * @post comment 
 */
router.post('/comments/:video', function(req, res) {
    youtube.comment.add(req.user.name, req.params.video, req.body.comment)
        .then(function(result) {
            res.send(result.result);
        });
});

module.exports = router;
