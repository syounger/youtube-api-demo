var _ = require('lodash');

var helpers = {

    /**
     * @brief formats and returns the fields we need
     * @param video listing from youtube api results
     * @return {id:, title:, thumbnail:, duration:}
     */
    extractVideoDetails: function(video, options) {
        var details = {
            id: helpers.getId(video),
            title: video.snippet.title,
            thumbnail: helpers.getVideoThumbnail(video.snippet.thumbnails, options.thumbnails.width)
        }
        if (video.contentDetails) {
            details.duration = helpers.parseYoutubeDuration(video.contentDetails.duration);
        }
        return details;
    },

    /**
     * wrapper for extracting details from an array of video results
     */
    videoDetailsList: function(videos, options) {
        return _.map(videos, function(v) {
            return helpers.extractVideoDetails(v, options);
        });
    },

    getId: function(video) {
        return video.id.videoId || video.id;
    },

    getVideoThumbnail: function(thumbnails, targetWidth) {
        return _.sortBy(thumbnails, function(v) {
            return Math.abs(targetWidth - v.width);
        })[0].url;
    },

    parseYoutubeDuration: function(dur) {
        return dur.replace(/[^0-9]+/g, ':').replace(/^:|:$/g, '');
    }

}

module.exports = helpers;