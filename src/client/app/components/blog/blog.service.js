function BlogService($resource) {
    var Article = $resource('/api/article/:id', {articleID: '@id'});
    var Comments = $resource('/api/comments');
    return {
        getArticles: function() {
            return Article.get().$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    return [];
                });
        },
        getArticleById: function (key) {
            return Article.get({id: key}).$promise
                .then(function (result) {
                    if(result.success) return result.results;
                    console.log('rejected');
                    throw new Error('Article doesn\'t exist!');
                });
        },
        getCommentsByArticle: function(obj) {
            if(!obj.parentID) obj.parentID = null;

            return Comments.get(obj).$promise
                .then(function (result) {

                    if(result.success) return result;

                    return [];
                });
        },
        postCommentForArticle: function(data) {

            return Comments.save(data).$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    return [];
                });
        },
        postArticle: function(data) {
            return Article.save(data).$promise
                .then(function (result) {
                    return result;
                });
        }
    }
}

BlogService.$inject = ['$resource'];

angular
    .module('components.blog')
    .factory('BlogService', BlogService);