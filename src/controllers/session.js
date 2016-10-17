import { Router } from 'express';
import passport from '../config/passport';
import * as User from '../models/user';
import sanitizers from '../helpers/sanitizers';
import validators from '../helpers/validators';
import _ from 'lodash'

let router = Router();
router.get('/', function(req, res) {
    console.log(req.session);
    if(req.isAuthenticated()) {
        if(!req.session.user) {
            User.model
                .forge({userID: req.session.passport.user})
                .fetch({withRelated: ['role']})
                .then(function(user) {
                    req.session.user = user.toJSON();
                    return res.json({
                        success: req.isAuthenticated(),
                        session: req.session.user
                    })
                });
        } else return res.json({
            success: req.isAuthenticated(),
            session: req.session.user
        })


    } else return res.json({success: false});
});

router.post('/login', function(req, res, next) {
    let criteria = {
        username: req.body.username|| null,
        password: req.body.password || null,
    };

    if(!_.every(criteria)) return res.json({
        success: false,
        message: 'Missing credentials'
    });

    passport.authenticate('local-login',
        function(err, user, info) { // callback with email and password from our form
            console.log(err, user, info);
            if(err) return res.json({
                success: false,
                message: err
            });

            if(!user) {
                return res.json({
                    success: false,
                    message: !info.field ? info.message : null,
                    errors: {
                        [info.field]: info
                    }
                });
            }

            req.login(user, function(err) {
                if (err) { return next(err); }

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

router.post('/signup', function(req, res, next) {
    let criteria = {
        username: req.body.username|| null,
        password: req.body.password || null,
        confirmPassword: req.body.confirmPassword || null
    };

    if(!_.every(criteria)) return res.json({
        success: false,
        message: 'Missing credentials'
    });

    if(criteria.password != criteria.confirmPassword) return res.json({
        success: false,
        message: 'Password does not match confirmed field.'
    });

    delete criteria.confirmPassword;

    let errors = {};
    let hasError = false;
    _.some(criteria, (val, key) => {
        let response = validators[key](val);
        if(response !== true) {
            hasError = true;
            errors[key] = response;
        }
        return response !== true;
    });

    if(hasError) return res.json({
        success: false,
        errors
    });
    passport.authenticate('local-signup',
        function(err, user, info) { // callback with email and password from our form
            console.log(err, user, info);
            if(err) return res.json({
                success: false,
                message: err
            });

            if(!user) {
                return res.json({
                    success: false,
                    message: !info.field ? info.message : null,
                    errors: {
                        [info.field]: info
                    }
                });
            }

            req.login(user, function(err) {
                if (err) { return next(err); }

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
    req.session.destroy(()=>{
        return res.json({
            success: true,
            message: 'you have logged out'
        });
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

export default router;