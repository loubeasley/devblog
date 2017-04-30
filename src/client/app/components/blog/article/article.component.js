var article = {
    bindings: {
        'article': '<',
        'preview': '<'
    },
    templateUrl: './article.html',
    controller: 'ArticleController'
};

angular
    .module('components.blog')
    .component('article', article);