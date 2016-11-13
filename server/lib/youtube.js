var axios = require('axios');
var util = require('util');
var logger = require('winston');
var bb = require('bluebird');

/**
 * interface to youtube API
 */
var youtube = function(config) {

    var mongo = require('./mongo')(config.mongo);

    return {
        search: function(query) {
            return this.apicache(util.format(config.youtube.api.url + '/search?q=%s&type=video&part=id,snippet&key=' + config.youtube.api.key, query));
        },

        details: function(query) {
            return this.apicache(util.format(config.youtube.api.url + '/videos?id=%s&part=contentDetails,snippet&key=' + config.youtube.api.key, query));
        },

        /**
         * @NOTE comments are stored locally, but for logical consistency the code is in the youtube module
         */
        comment: {
            add: function(username, video, comment) {
                return mongo.insert('comments', {
                    user: username,
                    video: video,
                    comment: comment,
		    created: Date.now()
                });
            },

            find: function(video, start, limit) {
                return mongo.find('comments', {
                        video: video
                    })
		    .then(function(cursor){
			    return cursor.sort({created: 1});
		    })
                    .then(function(cursor) {
                        if (start) {
                            cursor = cursor.skip(parseInt(start));
                        }
                        if (limit) {
                            cursor = cursor.limit(parseInt(limit));
                        }
                        return cursor.toArray();
                    });

            },

            count: function(video) {
                return mongo.count('comments', {
                    video: video
                });
            }
        },

        apicache: function(url) {
            return new bb.Promise(function(resolve, reject) {
                mongo.find('apicache', {
                        url: url,
                        expire: {
                            $gt: Date.now()
                        }
                    })
                    .then(function(cached) {
                        cached.count().then(function(count) {
                            if (count) {
                                cached.next().then(function(record) {
                                    logger.info('using cached record');
                                    resolve({
                                        data: record.data
                                    });
                                });
                            } else {
                                logger.info('calling youtube API - ', url);
                                axios.get(url)
                                    .then(function(result) {
                                        mongo.update('apicache', {
                                            url: url
                                        }, {
                                            url: url,
                                            expire: Date.now() + 3600 * 24,
                                            data: result.data
                                        }, {
                                            upsert: true
                                        });
                                        resolve(result);
                                    });
                            }
                        });
                    });
            });
        }

    };
};

module.exports = youtube;
