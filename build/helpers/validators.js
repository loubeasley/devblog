'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function fieldErr(field, type, msg, value) {
    return {
        field: field,
        type: type,
        message: msg,
        value: value
    };
}

exports.default = {
    username: function (_username) {
        function username(_x) {
            return _username.apply(this, arguments);
        }

        username.toString = function () {
            return _username.toString();
        };

        return username;
    }(function (username) {
        var field = 'username';
        if (!username || username.length < 1) return fieldErr(field, 'failed', 'Username is empty.', username);

        if (!username.match(/^[A-Za-z0-9_@.]*$/)) return fieldErr(field, 'failed', 'Username failed criteria.', username);

        if (username.length < 3) return fieldErr(field, 'failed', 'Username is too short.', username);

        if (username.length > 20) return fieldErr(field, 'failed', 'Username is too long.', username);

        return true;
    }),
    password: function password(_password) {
        var field = 'password';

        if (!_password || _password.length < 1) return fieldErr(field, 'failed', 'Password is empty.', username);

        if (_password.length < 8) return fieldErr(field, 'failed', 'Password is too short.', _password);

        if (_password.length > 40) return fieldErr(field, 'failed', 'Password is too long.', _password);

        return true;
    }
};