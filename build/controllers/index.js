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

var _role = require('../models/role');

var _role2 = _interopRequireDefault(_role);

var _roleassignment = require('../models/roleassignment');

var _roleassignment2 = _interopRequireDefault(_roleassignment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var api = (0, _express.Router)();

    api.use('/user', _user2.default);
    api.use('/article', _article2.default);
    api.use('/comments', _comments2.default);
    api.use('/session', _session2.default);

    api.get('/', function (req, res) {
        res.json({
            success: true,
            message: 'you took a wrong turn at asdalbuquerque'
        });
    });

    return api;
};