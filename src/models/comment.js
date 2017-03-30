import bookshelf from '../config/bookshelf';

let Comment = bookshelf.model('Comment', {
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
    },
    hasTimestamps: false
});

let CommentCollection = bookshelf.collection('Comment', {
    model: Comment
});


export default Comment;
export {Comment as model, CommentCollection as collection};