'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.collection = exports.model = undefined;

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _bookshelf = require('../config/bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _bookshelf2.default.model('User', {
    tableName: 'users',
    idAttribute: 'userID',
    role: function role() {
        return this.hasOne(_bookshelf2.default.model('RoleAssignment'), 'userID');
    }
}, {
    create: function create(data) {
        var password = _bcryptNodejs2.default.hashSync(data.password, null, null);

        return this.forge({
            otherID: data.otherID || null,
            username: data.username,
            password: password,
            access_token: data.access_token || null
        }).save().then(function (user) {
            return user.fetch({ withRelated: ['role'] }); //TODO JANK
        });
    },
    withRole: function withRole(data) {
        return this.query(function (qb) {
            qb.select(['users.username', 'users.userID', 'roleassignments.roleID', 'roleassignments.userID']).leftJoin('roleassignments', 'users.userID', 'roleassignments.userID').where('users.userID', data.userID);
        });
    }
});

User.prototype.toJSON = function () {
    return _.omit(this.serialize(), 'password');
};

var UserCollection = _bookshelf2.default.collection('User', {
    model: User
}, {
    findByID: function findByID(id) {
        return this.forge().query({ where: { userID: id } }).fetch();
    }
});

exports.default = User;
exports.model = User;
exports.collection = UserCollection;