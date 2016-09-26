var router = require('express').Router();
var passport = global.passport;
var User = bookshelf.model('User');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


router.get('/', function(req, res) {
    console.log(req.session);
    if(req.isAuthenticated())
        User.forge({userID: req.session.passport.user})
            .fetch({withRelated: ['roleassignment'], columns: ['username', 'userID']})
            .then(function(user) {
                if(user) return res.json({
                    success: req.isAuthenticated(),
                    session: user.toJSON()
                });

                return res.json({success: false});
            });

    else return res.json({success: false});
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local-login',
        function(err, user, info) { // callback with email and password from our form
            console.log(err, user, info);
            if(err) return res.json({
                success: false,
                message: err
            });

            if(!user) return res.json({
                success: false,
                message: info.message
            });

            req.login(user, function(err) {
                if (err) { return next(err); }

                if (req.body['remember']) {
                    req.session.cookie.maxAge = 1000 * 60 * 3;
                } else {
                    req.session.cookie.expires = false;
                }
            });

            console.log(req.session);

            return res.json({
                success: true,
                user: {
                    username: user.username,
                    userID: user.userID
                }
            });
    })(req, res, next);
});

router.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup',
        function(err, user, info) { // callback with email and password from our form
            console.log(err, user, info);
            if(err) return res.json({
                success: false,
                message: err
            });

            if(!user) return res.json({
                success: false,
                message: info.message
            });

            req.login(user, function(err) {
                if (err) { return next(err); }

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

router.post('/login2',
    passport.authenticate('local-login', { failWithError: true }),
    function(req, res) {
        console.log("hello");

        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
            req.session.cookie.expires = false;
        }
        res.json({
            success: true
        });
    },
    function(err, req, res, info) {
        //console.log(err);
        res.json({
            success: false,
            message: err.message
        });
    });

router.get('/logout', function(req, res) {
    req.logout();
    return res.json({
        success: true,
        message: 'you have logged out'
    });
});
router.get('/', function(req, res) {
    res.send('asdfasdf!');
});

// route for facebook authentication and login
// different scopes while logging in
router.get('/facebook',
    passport.authenticate('facebook', { failWithError: true, scope : 'email' }),
    function(req, res) {
        console.log("hello");

        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
            req.session.cookie.expires = false;
        }
        res.json({
            success: true
        });
    },
    function(err, req, res, info) {
        //console.log(err);
        res.json({
            success: false,
            message: err.message
        });
    });

// handle the callback after facebook has authenticated the user
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failWithError: true,
        successRedirect : '/',
        failureRedirect : '/'
    }),
    function(req, res) {

    },
    function(err, req, res, info) {
        //console.log(err);
        res.json({
            success: false,
            message: err.message
        });
    });

module.exports = router;