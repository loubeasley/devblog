var router = require('express').Router();
var User = require('../model/user');

router.route('/')
    // fetch all users
    .get(function (req, res) {
        User.collection.forge()
            .fetch({columns: ['username', 'userID']})
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
    // create a user
    .post(function (req, res) {
        User.model
            .create(req.body)
            .then(function (user) {
                res.json({
                    success: true,
                    message: 'User created.',
                    results: user.get('userID')
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

router.route('/:userID')
    // fetch user
    .get(function (req, res) {
        User.model.forge({userID: req.params.userID})
            .fetch({withRelated: ['roleassignment']}, {columns: ['username', 'userID', 'roleID']})
            .then(function (user) {
                if (!user) {
                    res.status(404).json({error: true, data: {}});
                }
                else {
                    res.json({error: false, data: user.toJSON()});
                }
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    })
    // update user details
    .put(function (req, res) {
        User.model.forge({userID: req.params.userID})
            .fetch({require: true})
            .then(function (user) {
                user.save({
                    username: req.body.username || user.get('username'),
                    password: req.body.password || user.get('password')
                })
                    .then(function () {
                        res.json({error: false, data: {message: 'User details updated'}});
                    })
                    .catch(function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    })
    // delete a user
    .delete(function (req, res) {
        User.model.forge({userID: req.params.userID})
            .fetch({require: true})
            .then(function (user) {
                user.destroy()
                    .then(function () {
                        res.json({error: true, data: {message: 'User successfully deleted'}});
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