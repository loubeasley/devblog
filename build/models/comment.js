'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.collection = exports.model = undefined;

var _bookshelf = require('../config/bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Comment = _bookshelf2.default.model('Comment', {
    tableName: 'comments',
    idAttribute: 'commentID',
    article: function article() {
        return this.belongsTo(_bookshelf2.default.model('Article'), 'articleID');
    },
    user: function user() {
        return this.belongsTo(_bookshelf2.default.model('User'), 'userID');
    },
    reply: function reply() {
        return this.hasMany(_bookshelf2.default.model('Comment'), 'parentID');
    }
    //hasTimestamps: true,
});

var CommentCollection = _bookshelf2.default.collection('Comment', {
    model: Comment
});

exports.default = Comment;
exports.model = Comment;
exports.collection = CommentCollection;