var mongoclient = require('mongodb').MongoClient;
var util = require('util');
var bb = require('bluebird');

mongo = function(config) {

    var conn_url = util.format('mongodb://%s:%d/%s', config.host, config.port, config.database);
    var mongo = null;
    mongoclient.connect(conn_url, function(err, db) {
        mongo = db;
    });

    return {

        insert: function(coll, record) {
            return new bb.Promise(function(resolve, reject) {
                mongo.collection(coll).insert(record, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        },

        update: function(coll, query, update, options) {
            return new bb.Promise(function(resolve, reject) {
                mongo.collection(coll).update(query, update, options, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        },

        count: function(coll, query) {
            return new bb.Promise(function(resolve, reject) {
                mongo.collection(coll).count(query, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        },

        find: function(coll, query) {
            return new bb.Promise(function(resolve, reject) {
                mongo.collection(coll).find(query, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        }
    }

}

module.exports = mongo;
