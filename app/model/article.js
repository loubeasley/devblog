var Article = bookshelf.model('Article', {
    tableName: 'articles',
    idAttribute: 'articleID',
    user: function() {
        return this.belongsTo(bookshelf.model('User'), 'userID');
    },
    comments: function() {
        return this.hasMany(bookshelf.model('Comment'), 'articleID');
    },
    getCommentsCount: function() {
        return bookshelf.model('Comment').query()
            .where("articleID", this.get('articleID'))
            .count();
    }
    //hasTimestamps: true,
});

var ArticleCollection = bookshelf.collection('Article', {
    model: Article
},
    {
        findByID: function(id) {
            return this.forge().query({where:{ articleID: id }}).fetch();
        }
    });

module.exports = {
    model: Article,
    collection: ArticleCollection
};