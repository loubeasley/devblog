'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _passport = require('../config/passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('../models/user');

var User = _interopRequireWildcard(_user);

var _sanitizers = require('../helpers/sanitizers');

var _sanitizers2 = _interopRequireDefault(_sanitizers);

var _validators = require('../helpers/validators');

var _validators2 = _interopRequireDefault(_validators);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var router = (0, _express.Router)();
router.get('/', function (req, res) {
    console.log(req.session);
    if (req.isAuthenticated()) {
        if (!req.session.user) {
            User.model.forge({ userID: req.session.passport.user }).fetch({ withRelated: ['role'] }).then(function (user) {
                req.session.user = user.toJSON();
                return res.json({
                    success: req.isAuthenticated(),
                    session: req.session.user
                });
            });
        } else return res.json({
            success: req.isAuthenticated(),
            session: req.session.user
        });
    } else return res.json({ success: false });
});

router.post('/login', function (req, res, next) {
    var criteria = {
        username: req.body.username || null,
        password: req.body.password || null
    };

    if (!_lodash2.default.every(criteria)) return res.json({
        success: false,
        message: 'Missing credentials'
    });

    _passport2.default.authenticate('local-login', function (err, user, info) {
        // callback with email and password from our form
        console.log(err, user, info);
        if (err) return res.json({
            success: false,
            message: err
        });

        if (!user) {
            return res.json({
                success: false,
                message: !info.field ? info.message : null,
                errors: _defineProperty({}, info.field, info)
            });
        }

        req.login(user, function (err) {
            if (err) {
                return next(err);
            }

            req.session.user = user;
            if (req.body['remember']) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
        });

        console.log(req.session);

        return res.json({
            success: true,
            user: user
        });
    })(req, res, next);
});

router.post('/signup', function (req, res, next) {
    var criteria = {
        username: req.body.username || null,
        password: req.body.password || null,
        confirmPassword: req.body.confirmPassword || null
    };

    if (!_lodash2.default.every(criteria)) return res.json({
        success: false,
        message: 'Missing credentials'
    });

    if (criteria.password != criteria.confirmPassword) return res.json({
        success: false,
        message: 'Password does not match confirmed field.'
    });

    delete criteria.confirmPassword;

    var errors = {};
    var hasError = false;
    _lodash2.default.some(criteria, function (val, key) {
        var response = _validators2.default[key](val);
        if (response !== true) {
            hasError = true;
            errors[key] = response;
        }
        return response !== true;
    });

    if (hasError) return res.json({
        success: false,
        errors: errors
    });
    _passport2.default.authenticate('local-signup', function (err, user, info) {
        // callback with email and password from our form
        console.log(err, user, info);
        if (err) return res.json({
            success: false,
            message: err
        });

        if (!user) {
            return res.json({
                success: false,
                message: !info.field ? info.message : null,
                errors: _defineProperty({}, info.field, info)
            });
        }

        req.login(user, function (err) {
            if (err) {
                return next(err);
            }

            req.session.user = user;
            if (req.body['remember']) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
        });

        return res.json({
            success: true,
            user: user
        });
    })(req, res, next);
});

router.post('/login2', _passport2.default.authenticate('local-login', { failWithError: true }), function (req, res) {
    console.log("hello");

    if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        req.session.cookie.expires = false;
    }
    res.json({
        success: true
    });
}, function (err, req, res, info) {
    //console.log(err);
    res.json({
        success: false,
        message: err.message
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(function () {
        return res.json({
            success: true,
            message: 'you have logged out'
        });
    });
});
router.get('/', function (req, res) {
    res.send('asdfasdf!');
});

// route for facebook authentication and login
// different scopes while logging in
router.get('/facebook', _passport2.default.authenticate('facebook', { failWithError: true, scope: 'email' }), function (req, res) {
    console.log("hello");

    if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        req.session.cookie.expires = false;
    }
    res.json({
        success: true
    });
}, function (err, req, res, info) {
    //console.log(err);
    res.json({
        success: false,
        message: err.message
    });
});

// handle the callback after facebook has authenticated the user
router.get('/facebook/callback', _passport2.default.authenticate('facebook', {
    failWithError: true,
    successRedirect: '/',
    failureRedirect: '/'
}), function (req, res) {}, function (err, req, res, info) {
    //console.log(err);
    res.json({
        success: false,
        message: err.message
    });
});

exports.default = router;