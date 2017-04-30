// When the app starts
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import BookshelfStore from 'connect-bookshelf';
import passport from './config/passport';
import * as Session from './models/session';
import StoreSim from './middleware/storeSimulation';
import config from './config';
import bookshelf from './config/bookshelf';
import api from './controllers';

let store = BookshelfStore(session);

let app = express();
global._ = require('lodash');

//----
app.use(express.static('./build/dist'));
app.get('/', function(req, res) {
    res.sendfile('build/dist/index.html');
    //res.send('all systems go');
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(cookieParser('vidyapathaisalwaysrunning'));
//----

app.use(session({
    store: new store({model: Session.model}),
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
} )); // session secret


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

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
app.use('/api', api());

app.listen(process.env.PORT || config.port, function() {
    console.log(`Started on port ${this.address().port}`);
});




let sim = new StoreSim();


export default app;