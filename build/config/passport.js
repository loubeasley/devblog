'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _passportFacebook = require('passport-facebook');

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _fb = require('./fb');

var _fb2 = _interopRequireDefault(_fb);

var _user = require('../models/user');

var User = _interopRequireWildcard(_user);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_passport2.default.serializeUser(function (user, done) {
    done(null, user.userID);
});

_passport2.default.deserializeUser(function (userID, done) {
    User.collection.forge().query({ where: { userID: userID } }).fetch().asCallback(function (err, rows) {
        done(err, rows.toJSON());
    });
});

_passport2.default.use('local-signup', new _passportLocal.Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, localSignup));

function localSignup(req, username, password, done) {
    User.collection.forge().query({ where: { username: username } }).fetch().asCallback(function (err, user) {
        if (err) return done(err);
        if (user.length) return done(null, false, {
            field: 'username',
            type: 'failed',
            message: 'Username is taken.',
            value: username
        });

        User.model.create({ username: username, password: password }).asCallback(function (err, user) {
            console.log("blarg!", user);
            return done(null, user.toJSON());
        });
    });
}

_passport2.default.use('local-login', new _passportLocal.Strategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
}, localLogin));

function localLogin(req, username, password, done) {
    // callback with email and password from our form
    console.log(username, password);
    User.model.forge({ username: username }).fetch({ withRelated: ['role'] }).asCallback(function (err, user) {
        if (!user) return done(null, false, {
            field: 'username',
            type: 'failed',
            message: 'User does not exist.',
            value: username
        });
        if (err) return done(err);

        // if the user is found but the password is wrong
        try {
            if (!_bcryptNodejs2.default.compareSync(password, user.get('password'))) {
                return done(null, false, {
                    field: 'password',
                    type: 'failed',
                    message: 'Password was incorrect.',
                    value: password
                }); // create the loginMessage and save it to session as flashdata
            }
        } catch (e) {
            return done(e);
        }

        // all is well, return successful user
        console.log("successful user found etc");
        return done(null, user.toJSON());
    });
}

_passport2.default.use('facebook', new _passportFacebook.Strategy({
    clientID: _fb2.default.appID,
    clientSecret: _fb2.default.appSecret,
    callbackURL: _fb2.default.callbackUrl,
    profileFields: ['email'],
    enableProof: true
},

// facebook will send back the tokens and profile
function (access_token, refresh_token, profile, done) {
    process.nextTick(function () {
        User.model.forge({ otherID: profile.id }).fetch({ withRelated: ['role'] }).asCallback(function (err, user) {

            if (err) return done(err);

            // if the user is found, then log them in
            if (user) {
                return done(null, user.toJSON()); // user found, return that user
            } else {
                console.log(access_token, refresh_token, profile);
                // if there is no user found with that facebook id, create them
                User.model.create({
                    otherID: profile.id,
                    username: profile.emails[0].value,
                    access_token: access_token
                }).asCallback(function (err, user) {
                    if (err) throw err;
                    return done(null, user.toJSON());
                });
            }
        });
    });
}));

exports.default = _passport2.default;