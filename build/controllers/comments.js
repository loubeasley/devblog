'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _auth = require('../middleware/auth');

var auth = _interopRequireWildcard(_auth);

var _comment = require('../models/comment');

var Comment = _interopRequireWildcard(_comment);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = (0, _express.Router)();

router.route('/').get(function (req, res) {
    console.log(req.query);
    //req.query.parentID = req.query.parentID || null;
    //if(req.query.parentID == 'root') req.query.parentID = null;

    Comment.model.forge().query({ where: req.query }).fetchAll({ withRelated: ['user' /* 'reply'*/] })
    /*.fetchPage({
        pageSize: 15,
        page: req.query.page || 1,
        withRelated: ['user', 'reply']
    })*/
    .then(function (collection) {
        res.json({
            success: true,
            results: collection.toJSON(),
            pagination: collection.pagination
        });
    }).catch(function (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
}).post(auth.user, function (req, res) {
    console.log(req.body);
    //var marked = require('marked');
    //req.body.body = marked(req.body.body);
    Comment.model.forge(req.body).save().then(function (comment) {
        return comment.load(['user']);
    }).then(function (comment) {
        return res.json({
            success: true,
            message: 'Article created.',
            results: comment.toJSON()
        });
    }).catch(function (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    });
});

exports.default = router;