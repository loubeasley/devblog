'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _auth = require('../middleware/auth');

var auth = _interopRequireWildcard(_auth);

var _user = require('../models/user');

var User = _interopRequireWildcard(_user);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = (0, _express.Router)();
router.route('/')
// fetch all users
.get(function (req, res) {
    User.collection.forge().fetch({ columns: ['username', 'userID'] }).then(function (collection) {
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
})
// create a user
.post(function (req, res) {
    User.model.create(req.body).then(function (user) {
        res.json({
            success: true,
            message: 'User created.',
            results: user.get('userID')
        });
    }).catch(function (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
});

router.route('/:userID')
// fetch user
.get(function (req, res) {
    User.model.forge({ userID: req.params.userID }).fetch({ withRelated: ['role'] }, { columns: ['username', 'userID', 'roleID'] }).then(function (user) {
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User does not exist.'
            });
        } else {
            res.json({
                success: true,
                results: user.toJSON()
            });
        }
    }).catch(function (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
})
// update user details
.put(auth.isYou, function (req, res) {
    User.model.forge({ userID: req.params.userID }).fetch({ require: true }).then(function (user) {
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User does not exist.'
            });
        }

        return user.save({
            username: req.body.username || user.get('username'),
            password: req.body.password || user.get('password')
        });
    }).then(function (user) {
        res.json({
            success: true,
            message: 'User details updated',
            user: user.toJSON()
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
    User.model.forge({ userID: req.params.userID }).fetch({ require: true }).then(function (user) {
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User does not exist.'
            });
        }
        return user.destroy();
    }).then(function (user) {
        res.json({
            success: true,
            message: 'User deleted.'
        });
    }).catch(function (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
});

exports.default = router;