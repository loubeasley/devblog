'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    username: function username(_username) {
        if (!_username) return '';
        return _username.replace(/^[A-Za-z0-9_@.]*$/, '').toLowerCase();
    },
    password: function password(_password) {
        if (!_password) return '';
        return _password;
    }
};