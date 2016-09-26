var router = require('express').Router();

var Article = require('../model/article');

router.route('/')
    .get(function (req, res) {
        Article.collection.forge()
            .fetch({withRelated: ['user']})
            .then(function (collection) {
                res.json({
                    success: true,
                    results: collection.toJSON()
                });
            })
            .catch(function (err) {
                res.status(500)
                    .json({
                        success: false,
                        message: err.message
                    });
            });
    })
    .post(function (req, res) {
        Article.model
            .forge(req.body)
            .save()
            .then(function (user) {
                res.json({
                    success: true,
                    message: 'Article created.',
                    results: user.get('articleID')
                });
            })
            .catch(function (err) {
                res.status(500)
                    .json({
                        success: false,
                        message: err.message
                    });
            });
    });
router.route('/:articleID')
    .get(function(req, res) {
        Article.model.forge()
            .query({where: {articleID: req.params['articleID']}})
            .fetch({withRelated: ['user', 'comments']})
            .then(function (collection) {
                res.json({
                    success: true,
                    results: collection.toJSON()
                });
            })
            .catch(function (err) {
                res.status(500)
                    .json({
                        success: false,
                        message: err.message
                    });
            });
    })
    .put(function (req, res) {
        Article.model.forge({articleID: req.params.articleID})
            .fetch({require: true})
            .then(function (user) {
                user.save(req.body)
                    .then(function (user) {
                        res.json({
                            success: true,
                            results: user.toJSON(),
                            message: 'Article updated.'
                        });
                    })
                    .catch(function (err) {
                        res.status(500)
                            .json({
                                success: false,
                                message: err.message
                            });
                    });
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    })
    // delete a user
    .delete(function (req, res) {
        Article.model.forge({articleID: req.params.articleID})
            .fetch({require: true})
            .then(function (user) {
                user.destroy()
                    .then(function () {
                        res.json({error: true, data: {message: 'Article successfully deleted'}});
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    });


module.exports = router;