'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.model = undefined;

var _bookshelf = require('../config/bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Session = _bookshelf2.default.model('Session', {
    tableName: 'sessions',
    hasTimestamps: false
});

exports.default = Session;
exports.model = Session;