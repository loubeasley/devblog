'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _article = require('./article');

var _article2 = _interopRequireDefault(_article);

var _comments = require('./comments');

var _comments2 = _interopRequireDefault(_comments);

var _session = require('./session');

var _session2 = _interopRequireDefault(_session);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var _category = require('./category');

var _category2 = _interopRequireDefault(_category);

var _cycle = require('./cycle');

var _cycle2 = _interopRequireDefault(_cycle);

var _audit = require('./audit');

var _audit2 = _interopRequireDefault(_audit);

var _bookshelf = require('../config/bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

var _role = require('../models/role');

var _role2 = _interopRequireDefault(_role);

var _roleassignment = require('../models/roleassignment');

var _roleassignment2 = _interopRequireDefault(_roleassignment);

var _knexLogger2 = require('knex-logger');

var _knexLogger3 = _interopRequireDefault(_knexLogger2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KnexLogger = (0, _knexLogger3.default)(_bookshelf2.default.knex);

exports.default = function () {
    var api = (0, _express.Router)();
    //api.use(KnexLogger);
    api.use('/user', _user2.default);
    api.use('/article', _article2.default);
    api.use('/comments', _comments2.default);
    api.use('/session', _session2.default);
    api.use('/item', _item2.default);
    api.use('/category', _category2.default);
    api.use('/cycle', _cycle2.default);
    api.use('/audit', _audit2.default);

    api.get('/', function (req, res) {
        res.json({
            success: true,
            message: 'you took a wrong turn at asdalbuquerque'
        });
    });

    return api;
};