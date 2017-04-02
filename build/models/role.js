'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.model = undefined;

var _bookshelf = require('../config/bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Role = _bookshelf2.default.model('Role', {
    tableName: 'roles',
    idAttribute: 'roleID',
    roleassignment: function roleassignment() {
        return this.belongsTo(_bookshelf2.default.model('RoleAssignment'), 'roleID');
    },
    hasTimestamps: false
});

exports.default = Role;
exports.model = Role;