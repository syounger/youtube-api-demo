var logger = require('winston')
logger.info('booting application');

var config = require('./server/config');
var jwt = require('express-jwt');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var api = require('./server/api');
var routes = require('./server/routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(jwt({
    secret: config.jwt.secret
}).unless({
    path: ['/', '/login']
}))

app.use(express.static('./public'));
app.use('/api', api);
app.use('/', routes);

app.use(function(err, req, res, next){
	if(err.code === 'credentials_required'){
	    res.status(401);
	    res.end();
	}else{
		logger.error('unknown error ', err);
		throw err;
	}
});

app.listen(config.port);
logger.info('app is running');
