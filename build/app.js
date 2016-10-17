'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _connectBookshelf = require('connect-bookshelf');

var _connectBookshelf2 = _interopRequireDefault(_connectBookshelf);

var _passport = require('./config/passport');

var _passport2 = _interopRequireDefault(_passport);

var _session = require('./models/session');

var Session = _interopRequireWildcard(_session);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _bookshelf = require('./config/bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

var _controllers = require('./controllers');

var _controllers2 = _interopRequireDefault(_controllers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// When the app starts
var store = (0, _connectBookshelf2.default)(_expressSession2.default);

var app = (0, _express2.default)();
global._ = require('lodash');

//----
app.use(_express2.default.static('./build/dist'));
app.get('/', function (req, res) {
    res.sendfile('build/dist/index.html');
    //res.send('all systems go');
});
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.json({ type: 'application/vnd.api+json' }));
app.use((0, _cookieParser2.default)('vidyapathaisalwaysrunning'));
//----

app.use((0, _expressSession2.default)({
    store: new store({ model: Session.model }),
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
})); // session secret


app.use(_passport2.default.initialize());
app.use(_passport2.default.session()); // persistent login sessions

// elsewhere, to use the bookshelf client:
//var bookshelf = app.get('bookshelf');
/*var apiPrefix = '/api/';
var Role = require('./models/role.js');
var RolA = require('./models/roleassignment.js');

fs.readdirSync('./app/controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        var route = require('./app/controllers/' + file);
        app.use(apiPrefix + file.slice(0, -3), route);
    }
});*/
app.use('/api', (0, _controllers2.default)());

app.listen(process.env.PORT || _config2.default.port, function () {
    console.log('Started on port ' + this.address().port);
});

exports.default = app;