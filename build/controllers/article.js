'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _auth = require('../middleware/auth');

var auth = _interopRequireWildcard(_auth);

var _article = require('../models/article');

var Article = _interopRequireWildcard(_article);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = (0, _express.Router)();

router.route('/').get(function (req, res) {
    Article.collection.forge().fetch({ withRelated: ['user'] }).then(function (collection) {
        res.json({
            success: true,
            results: collection.toJSON()
        });
    }).catch(function (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
}).post(auth.admin, function (req, res) {
    Article.model.forge(req.body).save().then(function (article) {
        res.json({
            success: true,
            message: 'Article created.',
            results: article.toJSON()
        });
    }).catch(function (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
});
router.route('/:articleID').get(function (req, res) {
    Article.model.forge().query({ where: { articleID: req.params['articleID'] } }).fetch({ withRelated: ['user', 'comments'] }).then(function (collection) {
        console.log(collection);
        if (!collection) throw new Error('Article doesn\'t exist');

        res.json({
            success: true,
            results: collection.toJSON()
        });
    }).catch(function (err) {
        res.json({
            success: false,
            message: err.message
        });
    });
}).put(auth.admin, function (req, res) {
    Article.model.forge({ articleID: req.params.articleID }).fetch({ require: true }).then(function (article) {
        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Article does not exist.'
            });
        }

        return article.save(req.body);
    }).then(function (article) {
        res.json({
            success: true,
            results: article.toJSON(),
            message: 'Article updated.'
        });
    }).catch(function (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
})
// delete a user
.delete(auth.admin, function (req, res) {
    Article.model.forge({ articleID: req.params.articleID }).fetch({ require: true }).then(function (article) {
        if (!article) {
            res.status(404).json({
                success: false,
                message: 'User does not exist.'
            });
        }

        return article.destroy();
    }).then(function (article) {
        res.json({
            success: true,
            message: 'Article deleted.',
            results: article.toJSON()
        });
    }).catch(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
    });
});

exports.default = router;