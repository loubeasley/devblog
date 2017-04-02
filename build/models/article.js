'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.model = exports.collection = undefined;

var _bookshelf = require('../config/bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Article = _bookshelf2.default.model('Article', {
    tableName: 'articles',
    idAttribute: 'articleID',
    user: function user() {
        return this.belongsTo(_bookshelf2.default.model('User'), 'userID');
    },
    comments: function comments() {
        return this.hasMany(_bookshelf2.default.model('Comment'), 'articleID');
    },
    getCommentsCount: function getCommentsCount() {
        return _bookshelf2.default.model('Comment').query().where("articleID", this.get('articleID')).count();
    },
    hasTimestamps: false
});

var ArticleCollection = _bookshelf2.default.collection('Article', {
    model: Article
}, {
    findByID: function findByID(id) {
        return this.forge().query({ where: { articleID: id } }).fetch();
    }
});

exports.default = Article;
exports.collection = ArticleCollection;
exports.model = Article;