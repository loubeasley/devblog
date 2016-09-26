// When the app starts
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session  = require('express-session');
var fs = require('fs');
var BookshelfStore = require('connect-bookshelf')(session);
global._ = require('lodash');

var cookies = require('cookie-parser');
var dbConfig = {
    client: 'mysql',
    connection: {
        host: 'd5x4ae6ze2og6sjo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'mxpzuc8vc2j244zm',
        password: 'mrfdv4oie28nniis',
        database: 'nbr16jqlmdzdgt6l',
        charset: 'utf8'
    }
};
app.use(express.static('dist'));
app.get('/', function(req, res) {
    res.sendfile('dist/index.html');
});

var knex = require('knex')(dbConfig);
global.bookshelf = require('bookshelf')(knex)
    .plugin('registry')
    .plugin('pagination');

app.set('bookshelf', bookshelf);
require('./app/model/user.js');
global.passport = require('passport');
require('./app/passport.js')(global.passport);



var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
};

app.use(allowCrossDomain);
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as jso
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(cookies('vidyapathaisalwaysrunning'));
app.use(session({
    store: new BookshelfStore({model: require('./app/model/session').model}),
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(global.passport.initialize());
app.use(global.passport.session()); // persistent login sessions

// elsewhere, to use the bookshelf client:
//var bookshelf = app.get('bookshelf');
var apiPrefix = '/api/';
var Role = require('./app/model/role.js');
var RolA = require('./app/model/roleassignment.js');

fs.readdirSync('./app/controller').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        var route = require('./app/controller/' + file);
        app.use(apiPrefix + file.slice(0, -3), route);
    }
});



console.log("HAPM!");
//app.use(require('./app/controller'));
// {our model definition code goes here}

app.listen(process.env.PORT || 3000, function() {
    console.log('Express started at port 3000');
});