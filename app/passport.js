var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs');
var fbConfig = require('./fb');

module.exports = function(passport) {
    var User = require('./model/user.js');

    passport.serializeUser(function(user, done) {
        done(null, user.userID);
    });

    passport.deserializeUser(function(userID, done) {
        User.collection.forge()
            .query({where: {userID: userID}})
            .fetch()
            .asCallback(function(err, rows){
                done(err, rows.toJSON());
            });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        }, localSignup));

    function localSignup(req, username, password, done) {
        User.collection.forge()
            .query({where: {username: username}})
            .fetch()
            .asCallback(function(err, user) {
                if (err) return done(err);
                if (user.length) return done(null, false, {message: 'That username is already taken.'});

                User.model.create({username: username, password: password})
                    .asCallback(function(err, user) {
                        console.log("blarg!", user);
                        return done(null, user.toJSON());
                    });
            });
    }

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        }, localLogin));

    function localLogin (req, username, password, done) { // callback with email and password from our form
        console.log(username, password);
        new User.model({username: username})
            .fetch()
            .asCallback(function(err, user){
                if(!user) return done(null, false, {message: 'user not found'});
                if (err) return done(err);

                // if the user is found but the password is wrong
                try {
                    if (!bcrypt.compareSync(password, user.get('password'))) {
                        return done(null, false, {message: 'wrong password'}); // create the loginMessage and save it to session as flashdata
                    }
                } catch(e) {
                    return done(e);
                }

                // all is well, return successful user
                console.log("successful user found etc");
                return done(null, user.toJSON());
            });
    }

    passport.use('facebook', new FacebookStrategy({
            clientID        : fbConfig.appID,
            clientSecret    : fbConfig.appSecret,
            callbackURL     : fbConfig.callbackUrl,
            profileFields: ['email'],
            enableProof: true
        },

        // facebook will send back the tokens and profile
        function(access_token, refresh_token, profile, done) {
            process.nextTick(function() {
                new User.model({otherID: profile.id})
                    .fetch()
                    .asCallback(function(err, user){

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
                            })
                                .asCallback(function(err, user) {
                                    if (err) throw err;
                                    return done(null, user.toJSON());
                                });
                        }

                    });
            });

        }));
};
