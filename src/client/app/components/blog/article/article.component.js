var article = {
    bindings: {
        'article': '<'
    },
    templateUrl: './article.html',
    controller: 'ArticleController'
};

angular
    .module('components.blog')
    .component('article', article);