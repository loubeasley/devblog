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
            host: 'd5x4ae6ze2og6sjo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'mxpzuc8vc2j244zm',
            password: 'mrfdv4oie28nniis',
            database: 'nbr16jqlmdzdgt6l',
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