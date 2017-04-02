'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.model = undefined;

var _bookshelf = require('../config/bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RoleAssignment = _bookshelf2.default.model('RoleAssignment', {
    tableName: 'roleassignments',
    idAttribute: 'roleassignmentID',
    user: function user() {
        return this.belongsTo(_bookshelf2.default.model('User'), 'userID');
    },
    hasTimestamps: false

});

module.exports = {
    model: RoleAssignment
};

exports.default = RoleAssignment;
exports.model = RoleAssignment;