'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bookshelf2 = require('bookshelf');

var _bookshelf3 = _interopRequireDefault(_bookshelf2);

var _knex2 = require('knex');

var _knex3 = _interopRequireDefault(_knex2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connections = {
    production: {
        client: 'mysql',
        connection: {
            host: 'nt71li6axbkq1q6a.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'fi7jkxtj94gpzuow',
            password: 'v4xtcyrx27f4ho9k',
            database: 'uy5d6q1uth4xzbs8',
            charset: 'utf8'
        }
    },
    development: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'Sinus1234',
            database: 'devblog',
            charset: 'utf8'
        }
    }
};

var _knex = (0, _knex3.default)(connections[process.env.NODE_ENV || 'development']);

var _bookshelf = (0, _bookshelf3.default)(_knex).plugin('registry').plugin('pagination');

exports.default = _bookshelf;