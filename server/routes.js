var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('./config');

/**
 * login
 * @post username
 * @post password
 * @note will automatically create the user if they do not exist
 */
router.post('/login', function(req, res) {
    // in real life, check password & login user
    var token = jwt.sign({
        name: req.body.username
    }, config.jwt.secret, {
        expiresIn: 3600
    });
    res.json({
        token: token
    });
});

router.get('/user', function(req, res){
	res.send(req.user.name);
});

module.exports = router;
