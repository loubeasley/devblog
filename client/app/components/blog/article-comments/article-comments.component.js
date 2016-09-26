var articleComments = {
    templateUrl: './article-comments.html',
    controller: 'ArticleCommentsController',
    bindings: {
        article: '<',
        comments: '<'
    }
};

angular
    .module('components.blog')
    .component('articleComments', articleComments);