function ArticleService($resource) {
    var Article = $resource('/api/article/:articleID', null,
        {
            'update': { method: 'PUT' }
        }
    );
    return {
        getArticles: function() {
            return Article.get().$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    return [];
                });
        },
        getArticleById: function (key) {
            return Article.get({articleID: key}).$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    console.log(result);

                    return [];
                });
        },
        postArticle: function(data) {
            return Article.save(data).$promise
        },
        updateArticle: function(id, data) {
            return Article.update(id, data).$promise
        },
        deleteArticle: function(data) {
            return Article.remove(data).$promise
        }
    }
}

ArticleService.$inject = ['$resource'];

angular
    .module('components.blog')
    .factory('ArticleService', ArticleService);