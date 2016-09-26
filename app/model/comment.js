var Comment = bookshelf.model('Comment', {
    tableName: 'comments',
    idAttribute: 'commentID',
    article: function() {
        return this.belongsTo(bookshelf.model('Article'), 'articleID');
    },
    user: function() {
        return this.belongsTo(bookshelf.model('User'), 'userID');
    },
    reply: function() {
        return this.hasMany(bookshelf.model('Comment'), 'parentID');
    }
    //hasTimestamps: true,
});

var CommentCollection = bookshelf.collection('Comment', {
    model: Comment
});

module.exports = {
    model: Comment,
    collection: CommentCollection
};