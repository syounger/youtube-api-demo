var frisby = require('frisby');
var config = require('../server/config');
var axios = require('axios');
var util = require('util');

var api = util.format('http://%s:%s/api/', config.hostname, config.port);

var token = null;

frisby.create('requests fail before login')
    .get(util.format('http://%s:%s/user', config.hostname, config.port))
    .expectStatus(401)
    .toss();

frisby.create('Login')
    .post(util.format('http://%s:%s/login', config.hostname, config.port), {
        username: "test"
    })
    .expectStatus(200)
    .toss();

axios.post(util.format('http://%s:%s/login', config.hostname, config.port), {
    username: "test"
}).then(function(res) {
    var token = res.data.token;

    frisby.create('Search')
        .addHeader('Authorization', 'Bearer ' + token)
        .get(api + 'search/abc')
        .expectStatus(200)
        .expectJSONLength('*', 3)
        .expectJSONTypes('?', {
            id: String,
            title: String,
            thumbnail: String
        })
        .toss();

    frisby.create('Details')
        .addHeader('Authorization', 'Bearer ' + token)
        .get(api + 'details/a3qY1d1X4cs')
        .expectStatus(200)
        .expectJSONLength(4)
        .expectJSONTypes({
            id: String,
            title: String,
            thumbnail: String,
            duration: function(d) {
                return d.match(/([0-9]+:)+[09-]+/);
            }
        })
        .toss();

    frisby.create('Details for non-existent video returns empty object')
        .addHeader('Authorization', 'Bearer ' + token)
        .get(api + 'details/x')
        .expectStatus(200)
        .expectJSONLength(0)
        .toss();

    frisby.create('Add Comment')
        .addHeader('Authorization', 'Bearer ' + token)
        .post(api + 'comments/test', {
            comment: 'Test comment'
        })
        .expectStatus(200)
        .expectJSON({
            ok: 1
        })
        .toss();

    frisby.create('Get Comments')
        .addHeader('Authorization', 'Bearer ' + token)
        .get(api + 'comments/test?start=1&count=5')
        .expectStatus(200)
        .expectJSONTypes({
            comments: Array,
            count: Number
        })
        .toss();

    frisby.create('Comments for non-existent video return length 0, empty list')
        .addHeader('Authorization', 'Bearer ' + token)
        .get(api + 'comments/x?start=1&count=5')
        .expectStatus(200)
        .expectJSON({
            comments: [],
            count: 0
        })
        .toss();

});
